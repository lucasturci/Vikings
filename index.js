const express = require('express')
const app = express()

const Game = require('./Game.js')

const http = require('http').Server(app)
const io = require('socket.io')(http)
const crypto = require('crypto')

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

const games = new Map()
const roomsOfSocket = new Map()
const newRoom = () => {
	let roomId

	do {
		roomId = crypto.randomBytes(10).toString('hex')
	} while (games.has(roomId))

	return roomId
}

io.on('connection', (socket) => {
	console.log('New user connected')

	socket.on('CREATE_ROOM', () => {
		const roomId = newRoom()
		games.set(roomId, new Game(io, roomId)) // creates an empty room

		console.log('Created new room ', roomId)
		let game = games.get(roomId)
		game.addPlayer(socket.id)
		roomsOfSocket.set(socket.id, roomId)
		socket.join(roomId)

		io.to(socket.id).emit('JOINED', roomId)
	})

	socket.on('JOIN', (gameId) => {
		if (games.has(gameId) === false) {
			io.to(socket.id).emit('ALERT_ERR', "This room id doesn't exit")
		} else {
			let game = games.get(gameId)

			if (game.full()) {
				io.to(socket.id).emit('ALERT_ERR', 'This room is full')
				return
			} else {
				game.addPlayer(socket.id)
			}

			io.to(socket.id).emit('JOINED', gameId)
			socket.join(gameId)
			roomsOfSocket.set(socket.id, gameId)

			if (game.full()) {
				// ask players if they are ready
				io.in(gameId).emit('READY?')
			}
		}
	})

	socket.on('READY!', () => {
		const gameId = roomsOfSocket.get(socket.id)
		const game = games.get(gameId)
		game.playerReady(socket.id)
	})

	socket.on('disconnect', () => {
		if (roomsOfSocket.has(socket.id)) {
			const roomId = roomsOfSocket.get(socket.id)
			const game = games.get(roomId)

			io.in(roomId).emit(`User ${socket.id} disconnected`)
			roomsOfSocket.delete(socket.id)

			game.removePlayer(socket.id)
		}

		console.log(`User ${socket.id} disconnected`)
	})
})
