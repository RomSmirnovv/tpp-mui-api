import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Fingerprint from "express-fingerprint"
import cookieParser from "cookie-parser"
import mongoose from 'mongoose'
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
import { Server } from "socket.io";
import NotificationRepository from './repositories/Notification.js'
import NotificationService from './services/Notification.js'
import MessageService from './services/Message.js'

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL

const app = express();

app.use(cookieParser());
app.use(express.json());



app.use(cors({ credentials: true, origin: [process.env.CLIENT_URL, process.env.LOCAL_CLIENT_URL] }));

app.use(
	Fingerprint({
		parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
	})
);

mongoose
	.connect(DB_URL)
	.then(() => console.log('Connected to Mongo'))
	.catch((err) => console.log(`${err}`))

const server = createServer(app);

export const io = new Server(server,
	{
		cors: {
			origin: "*",
			methods: ["GET", "POST"]
		}
	}
);

io.on('connection', (socket) => {

	socket.on('join', async ({ room }) => {
		socket.join(room);

		const notifications = await NotificationService.getAllNotifications(room);

		socket.emit("getAllNotifications", notifications);

		io.on('disconnect', () => {
			console.log("Disconnected");
		})
	})


	socket.on('joinChat', async (rooms) => {
		if (!rooms) return

		const roomsName = rooms.map((r) => {
			return r.room.join('-')
		})

		roomsName.forEach((r) => {
			socket.join(r);
		})

		const activeRoom = rooms.find((r) => r.active === true)?.room.join('-')
		const messages = await MessageService.getAllByRoom(activeRoom);
		socket.emit("getAllMessages", messages)

		io.on('disconnect', () => {
			console.log("Disconnected");
		})
	})

	socket.on('send_message', ({ message }) => {
		io.in(message.room).emit('getMessage', { message: message });
		MessageService.create(message);
	})
})


server.listen(PORT, () => {
	console.log("Сервер успешно запущен");
})

app.use("/auth", AuthRootRouter);
app.use("", userRouter);
app.use("", companyRouter);
app.use("", listRouter);
app.use("", notificationRouter);
app.use("", columnRouter);
app.use("", messageRouter);
app.use("", draftColumnRouter);
app.use("", draftRowRouter);
app.use("", draftRouter);


