const express = require('express')
const app = express()
const path = require('path')

const server = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
})

app.use(express.static(path.join(__dirname, '/public')))

let clients = []

io.on('connection', (socket) => {
	console.log('new socket connection')
	console.log(socket.id)

	socket.on('join', (data) => {
		clients.push({ user: data.name, roomID: data.roomID, socketId: socket.id })
		socket.join(data.roomID);
		io.in(data.roomID).emit('join', clients)
	})


	socket.on('send_text', (data) => {
		const user = clients.filter(item => item.socketId === socket.id)
		io.to(user[0].roomID).emit('send_text', { data })
	})


	socket.on('disconnecting', () => {
		const user = clients.filter(item => item.socketId === socket.id)
		const roomID = user[0].roomID
		clients = clients.filter(item => item.socketId !== socket.id)
		io.to(roomID).emit('join', clients)
	})

})

const PORT = 3001 || process.env.PORT

server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})