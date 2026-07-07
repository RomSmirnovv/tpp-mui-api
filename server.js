import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Fingerprint from 'express-fingerprint';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cron from 'node-cron';

import AuthRootRouter from './routers/Auth.js';
import HealthRouter from './routers/Health.js';
import userRouter from './routers/User.js';
import companyRouter from './routers/Company.js';
import listRouter from './routers/List.js';
import notificationRouter from './routers/Notification.js';
import draftColumnRouter from './routers/DraftColumns.js';
import draftRowRouter from './routers/DraftRows.js';
import draftRouter from './routers/Draft.js';
import columnRouter from './routers/Column.js';
import messageRouter from './routers/Message.js';

import NotificationService from './services/Notification.js';
import MessageService from './services/Message.js';
import AuthService from './services/Auth.js';
import TokenService from './services/Token.js';
import { roomIncludesCurrentUser } from './middlewares/ownership.js';

dotenv.config();

const requiredEnv = [
  'DB_URL',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  throw new Error(`Не заданы обязательные переменные окружения: ${missingEnv.join(', ')}`);
}

const PORT = Number(process.env.PORT || 5000);
const app = express();
const server = createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.LOCAL_CLIENT_URL,
]
  .filter(Boolean)
  .map((value) => value.replace(/\/$/, ''));

const corsOptions = {
  origin(origin, callback) {
    // curl, PM2-healthchecks и same-origin запросы без Origin разрешаем.
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
  Fingerprint({
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  }),
);

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

const socketCookieParser = cookieParser();

io.use((socket, next) => {
  socketCookieParser(socket.request, {}, async (error) => {
    if (error) {
      return next(error);
    }

    try {
      const accessToken = TokenService.extractAccessToken(socket.request);
      socket.data.auth = await AuthService.authenticateSocket(accessToken);
      return next();
    } catch (authError) {
      return next(new Error('Unauthorized'));
    }
  });
});

io.on('connection', (socket) => {
  const auth = socket.data.auth;

  socket.on('join', async () => {
    socket.join(auth._id);

    try {
      const notifications = await NotificationService.getAllNotifications(auth._id);
      socket.emit('getAllNotifications', notifications);
    } catch (error) {
      socket.emit('socketError', { message: 'Не удалось загрузить уведомления' });
    }
  });

  socket.on('joinChat', async (rooms) => {
    if (!Array.isArray(rooms)) {
      return;
    }

    const safeRooms = rooms
      .filter((entry) => Array.isArray(entry?.room))
      .map((entry) => ({
        ...entry,
        name: entry.room.map(String).sort().join('-'),
      }))
      .filter((entry) => entry.name === 'all-chat' || entry.room.map(String).includes(String(auth._id)));

    safeRooms.forEach((room) => socket.join(room.name));

    const activeRoom = safeRooms.find((room) => room.active)?.name;
    if (!activeRoom) {
      return;
    }

    try {
      const messages = await MessageService.getAllByRoom(activeRoom);
      socket.emit('getAllMessages', messages);
    } catch {
      socket.emit('socketError', { message: 'Не удалось загрузить сообщения' });
    }
  });

  socket.on('send_message', async ({ message } = {}) => {
    try {
      if (!message?.room || !roomIncludesCurrentUser(message.room, auth._id)) {
        return;
      }

      const safeMessage = {
        ...message,
        userId: String(auth._id),
        fullName: auth.fullName,
      };

      await MessageService.create(safeMessage);
      io.in(String(safeMessage.room)).emit('getMessage', { message: safeMessage });
    } catch {
      socket.emit('socketError', { message: 'Не удалось отправить сообщение' });
    }
  });
});

app.use('/health', HealthRouter);
app.use('/auth', AuthRootRouter);
app.use('', userRouter);
app.use('', companyRouter);
app.use('', listRouter);
app.use('', notificationRouter);
app.use('', columnRouter);
app.use('', messageRouter);
app.use('', draftColumnRouter);
app.use('', draftRowRouter);
app.use('', draftRouter);

const start = async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log('Connected to MongoDB');

  cron.schedule('* * * * *', async () => {
    try {
      await NotificationService.sendedNotification();
    } catch (error) {
      console.error('Notification cron error:', error?.message || error);
    }
  });

  server.listen(PORT, () => {
    console.log(`TPP API is listening on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
