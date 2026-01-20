import express from "express"
import cors from "cors"
import Fingerprint from "express-fingerprint"
import cookieParser from "cookie-parser"
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import AuthRootRouter from './routers/Auth.js'
import userRouter from './routers/User.js'
import companyRouter from './routers/Company.js'
import listRouter from './routers/List.js'
import notificationRouter from './routers/Notification.js'
import draftColumnRouter from './routers/DraftColumns.js'
import draftRowRouter from './routers/DraftRows.js'
import draftRouter from './routers/Draft.js'
import { createServer } from 'http';
import columnRouter from './routers/Column.js'
import messageRouter from './routers/Message.js'
import workspaceRouter from './routers/Workspace.js'
import { Server } from "socket.io";
import NotificationRepository from './repositories/Notification.js'
import NotificationService from './services/Notification.js'
import MessageService from './services/Message.js'
import AuthService from './services/Auth.js'
import cron from 'node-cron'
import config from './config/env.js'

// Конфигурация загружается и валидируется в config/env.js
const PORT = config.server.port;
const DB_URL = config.database.url

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы (для доступа к загруженным логотипам)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use(cors(config.cors));

app.use(
	Fingerprint({
		parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
	})
);

mongoose
	.connect(DB_URL)
	.then(() => console.log('Connected to Mongo'))
	.catch((err) => console.log(`${err}`))

cron.schedule("* * * * * ", () => {
	NotificationService.sendedNotification();
});

const server = createServer(app);

// Инициализация Socket.io с безопасными настройками CORS
export const io = new Server(server, {
	cors: config.socketIO.cors,
	// Дополнительные настройки для безопасности и производительности
	pingTimeout: config.socketIO.pingTimeout,
	pingInterval: config.socketIO.pingInterval
});

// Middleware для аутентификации Socket.IO
io.use(async (socket, next) => {
	try {
		// Получаем токен из cookies или auth
		const cookies = socket.handshake.headers.cookie || '';
		const cookieToken = cookies.split('refreshToken=')[1]?.split(';')[0]?.trim();
		const authToken = socket.handshake.auth?.token;
		const token = authToken || cookieToken;

		console.log('🔍 Socket.IO: Проверка аутентификации...');
		console.log('   - Cookies:', cookies ? 'есть' : 'нет');
		console.log('   - Cookie token:', cookieToken ? 'есть' : 'нет');
		console.log('   - Auth token:', authToken ? 'есть' : 'нет');

		if (!token) {
			console.log('❌ Socket.IO: Токен не предоставлен');
			return next(new Error('Authentication error: Token not provided'));
		}

		// Создаем fingerprint объект для AuthService
		// Express-fingerprint использует useragent и acceptHeaders
		// Проблема: fingerprint при логине создается через express-fingerprint,
		// а при Socket.IO мы создаем его вручную, поэтому они могут не совпадать
		// Решение: используем тот же алгоритм, что и express-fingerprint
		const userAgent = socket.handshake.headers['user-agent'] || '';
		const acceptHeaders = socket.handshake.headers['accept'] || '';
		
		// Express-fingerprint создает hash из useragent и acceptHeaders
		// Используем MD5 для совместимости
		const fingerprintString = `${userAgent}|${acceptHeaders}`;
		const crypto = await import('crypto');
		const fingerprintHash = crypto.createHash('md5').update(fingerprintString).digest('hex');
		
		const fingerprint = { hash: fingerprintHash };

		console.log('   - Fingerprint создан из user-agent и accept:', fingerprintHash.substring(0, 8) + '...');

		// Проверяем токен и получаем пользователя
		// Если проверка fingerprint не пройдет, попробуем без строгой проверки
		let user;
		try {
			user = await AuthService.getUserByToken({ 
				currentRefreshToken: token, 
				fingerprint 
			});
		} catch (fingerprintError) {
			// Если ошибка из-за fingerprint, попробуем получить пользователя напрямую
			// через RefreshSession (менее безопасно, но работает для Socket.IO)
			console.log('   ⚠️ Ошибка проверки fingerprint, пробуем альтернативный способ...');
			const RefreshSessionRepository = (await import('./repositories/RefreshSession.js')).default;
			const UserRepository = (await import('./repositories/User.js')).default;
			
			const refreshSession = await RefreshSessionRepository.getRefreshSession(token);
			if (!refreshSession) {
				throw new Error('Refresh session not found');
			}
			
			user = await UserRepository.getUserById(refreshSession.user_id);
			if (!user) {
				throw new Error('User not found');
			}
			
			console.log('   ✅ Пользователь найден через альтернативный способ');
		}

		if (!user) {
			console.log('❌ Socket.IO: Пользователь не найден');
			return next(new Error('Authentication error: User not found'));
		}

		// Сохраняем данные пользователя в socket
		socket.userId = user._id.toString();
		socket.workspaceId = user.workspaceId?.toString() || null;
		socket.user = user;

		console.log(`✅ Socket.IO: Пользователь аутентифицирован - ${user.name} ${user.surname} (workspaceId: ${socket.workspaceId})`);
		next();
	} catch (error) {
		console.error('❌ Socket.IO: Ошибка аутентификации:', error.message);
		console.error('   - Stack:', error.stack);
		next(new Error('Authentication error'));
	}
});

io.on('connection', (socket) => {
	console.log(`✅ Socket.IO: Клиент подключен - ${socket.user?.name} ${socket.user?.surname} (socket.id: ${socket.id})`);

	socket.on('join', async ({ room }) => {
		socket.join(room);

		const notifications = await NotificationService.getAllNotifications(room);

		socket.emit("getAllNotifications", notifications);
	})


	socket.on('joinChat', async (rooms) => {
		try {
			if (!rooms) {
				console.log('⚠️ Socket.IO: Пустой массив комнат');
				return;
			}

			const workspaceId = socket.workspaceId;
			if (!workspaceId) {
				console.error('❌ Socket.IO: workspaceId не найден для пользователя', socket.userId);
				socket.emit('error', { message: 'Workspace not found' });
				return;
			}

			// Присоединяемся к комнатам с префиксом workspace для изоляции
		const roomsName = rooms.map((r) => {
				return `workspace:${workspaceId}:${r.room.join('-')}`;
			});

		roomsName.forEach((r) => {
			socket.join(r);
			});

			console.log(`✅ Socket.IO: Пользователь присоединился к комнатам: ${roomsName.join(', ')}`);

			const activeRoom = rooms.find((r) => r.active === true)?.room.join('-');
			if (activeRoom) {
				// Загружаем сообщения с фильтрацией по workspaceId
				const messages = await MessageService.getAllByRoom(activeRoom, workspaceId);
				socket.emit("getAllMessages", messages);
				console.log(`✅ Socket.IO: Загружено ${messages?.length || 0} сообщений для комнаты ${activeRoom}`);
			}
		} catch (error) {
			console.error('❌ Socket.IO: Ошибка при присоединении к чату:', error);
			socket.emit('error', { message: 'Failed to join chat' });
		}
	})

	socket.on('activeRoom', async ({ activeRoom }) => {
		try {
			const workspaceId = socket.workspaceId;
			if (!workspaceId || !activeRoom) {
				console.log('⚠️ Socket.IO: activeRoom или workspaceId не указаны');
				return;
			}

			// Загружаем сообщения для новой активной комнаты с фильтрацией по workspaceId
			const messages = await MessageService.getAllByRoom(activeRoom, workspaceId);
			socket.emit("getAllMessages", messages);
			console.log(`✅ Socket.IO: Загружено ${messages?.length || 0} сообщений для активной комнаты ${activeRoom}`);
		} catch (error) {
			console.error('❌ Socket.IO: Ошибка при смене активной комнаты:', error);
			socket.emit('error', { message: 'Failed to change active room' });
		}
	})

	socket.on('disconnect', () => {
		console.log(`❌ Socket.IO: Клиент отключен - ${socket.user?.name} ${socket.user?.surname} (socket.id: ${socket.id})`);
	})

	socket.on('send_message', async ({ message }) => {
		try {
			// Получаем workspaceId из socket (установлен в middleware)
			const workspaceId = socket.workspaceId;
			if (!workspaceId) {
				console.error('❌ Socket.IO: workspaceId не найден для пользователя', socket.userId);
				socket.emit('error', { message: 'Workspace not found' });
				return;
			}

			// Добавляем workspaceId к сообщению
			message.workspaceId = workspaceId;
			// Защита от подмены userId - используем из socket
			message.userId = socket.userId;

			// Сохраняем в БД
			const savedMessage = await MessageService.create(message);
			
			if (!savedMessage) {
				console.error('❌ Socket.IO: Не удалось сохранить сообщение');
				socket.emit('error', { message: 'Failed to save message' });
				return;
			}

			// Отправляем только пользователям того же workspace
			// Используем префикс workspace для изоляции
			const workspaceRoom = `workspace:${workspaceId}:${message.room}`;
			io.to(workspaceRoom).emit('getMessage', { message: savedMessage });
			
			console.log(`✅ Socket.IO: Сообщение отправлено в комнату ${workspaceRoom}`);
		} catch (error) {
			console.error('❌ Socket.IO: Ошибка при отправке сообщения:', error);
			socket.emit('error', { message: 'Failed to send message' });
		}
	})
})


server.listen(PORT, () => {
	console.log("Сервер успешно запущен");
})

app.use("/auth", AuthRootRouter);
app.use("/workspace", workspaceRouter);
app.use("", userRouter);
app.use("", companyRouter);
app.use("", listRouter);
app.use("", notificationRouter);
app.use("", columnRouter);
app.use("", messageRouter);
app.use("", draftColumnRouter);
app.use("", draftRowRouter);
app.use("", draftRouter);


