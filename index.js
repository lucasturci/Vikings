const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)
const crypto = require('crypto')

const max_in_room = 2
const port = 8081
const webport = 80
http.listen(port, () => {
	console.log('Listening for socket connections on port', port)
})

app.listen(webport, () => {
	console.log('Listening for static web files on port', webport)
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.get('/static/:filename', (req, res) => {
	res.sendFile(__dirname + '/dist/' + req.params.filename)
})

const rooms = new Map()
const roomsOfSocket = new Map()
const newRoom = () => {
	let roomId

	do {
		roomId = crypto.randomBytes(10).toString('hex')
	} while (rooms.has(roomId))

	rooms.set(roomId, []) // creates an empty room
	return roomId
}

io.on('connection', (socket) => {
	console.log('New user connected')

	socket.on('CREATE_ROOM', () => {
		const roomId = newRoom()

		console.log('Created new room ', roomId)
		let arr = rooms.get(roomId)
		arr.push(socket.id)
		rooms.set(roomId, arr)
		roomsOfSocket.set(socket.id, roomId)
		socket.join(roomId)

		io.to(socket.id).emit('JOINED', roomId)
	})

	socket.on('JOIN', (roomId) => {
		if (rooms.has(roomId) === false) {
			io.to(socket.id).emit('ALERT_ERR', "This room id doesn't exit")
		} else {
			let arr = rooms.get(roomId)

			if (arr.length === max_in_room) {
				io.to(socket.id).emit('ALERT_ERR', 'This room is full')
				return
			} else {
				arr.push(socket.id)
			}

			rooms.set(roomId, arr)
			io.to(socket.id).emit('JOINED', roomId)
			socket.join(roomId)
			roomsOfSocket.set(socket.id, roomId)

			if (arr.length === max_in_room) {
				// ask players if they are ready
				io.in(roomId).emit('READY?')
			}
		}
	})

	socket.on('disconnect', () => {
		if (roomsOfSocket.has(socket.id)) {
			const roomId = roomsOfSocket.get(socket.id)
			const arr = rooms.get(roomId)

			io.in(roomId).emit(`User ${socket.id} disconnected`)
			roomsOfSocket.delete(socket.id)
			rooms.set(
				roomId,
				arr.filter((id) => id !== socket.id), // remove esse id
			)
		}

		console.log(`User ${socket.id} disconnected`)
	})
})
