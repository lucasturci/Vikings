const {
	initialBoard,
	swapPositionsOfBoard,
	checksEaten,
} = require('./src/GameUtils')

class Game {
	constructor(socketInstance, roomId) {
		this.max_players = 2
		this.players = []
		this.ready = [false, false]
		this.socketInstance = socketInstance
		this.roomId = roomId
		this.started = false
		this.board = []
		this.turn = 0
	}

	addPlayer(playerId) {
		this.players.push(playerId)
	}

	removePlayer(playerId) {
		this.ready[this.players.indexOf(playerId)] = false
		this.players = this.players.filter((id) => id !== playerId)
	}

	playerReady(playerId) {
		this.ready[this.players.indexOf(playerId)] = true

		if (this.ready[0] && this.ready[1] && !this.started) this.start()
	}

	full() {
		return this.players.length === this.max_players
	}

	start() {
		this.started = true
		console.log('Starting game!')

		this.socketInstance.in(this.roomId).emit('STARTING')
		this.socketInstance.to(this.players[0]).emit('YOU ARE PLAYER', 'W')
		this.socketInstance
			.to(this.players[0])
			.emit('GAME MESSAGE', 'You are the defender!')
		this.socketInstance.to(this.players[1]).emit('YOU ARE PLAYER', 'B')
		this.socketInstance
			.to(this.players[1])
			.emit('GAME MESSAGE', 'You are the attacker!')
		this.socketInstance
			.to(this.players[1])
			.emit('GAME MESSAGE', 'You move!')
		this.socketInstance.in(this.roomId).emit('UPDATE BOARD', initialBoard)
		this.socketInstance.to(this.players[1]).emit('YOUR TURN')

		this.board = initialBoard
		this.turn = 1
	}

	// Returns new board after the move pos1 => pos2
	// Assumes the move is valid, and just updates the board accordingly and checks if someone won or a draw happened (?)
	move(board, pos1, pos2) {
		this.board = swapPositionsOfBoard(board, pos1, pos2)
		if (checksEaten(this.board, pos2 + 1, pos2)) {
			this.board[pos2 + 1] = '.'
		}
		if (checksEaten(this.board, pos2 - 1, pos2)) {
			this.board[pos2 - 1] = '.'
		}
		if (checksEaten(this.board, pos2 + 11, pos2)) {
			this.board[pos2 + 11] = '.'
		}
		if (checksEaten(this.board, pos2 - 11, pos2)) {
			this.board[pos2 - 11] = '.'
		}

		// WILL CHECK IF GAME IS OVER

		this.turn = 1 - this.turn
		this.socketInstance.in(this.roomId).emit('UPDATE BOARD', this.board)
		this.socketInstance.to(this.players[this.turn]).emit('YOUR TURN')
		this.socketInstance
			.to(this.players[this.turn])
			.emit('UPDATE LAST MOVE', pos1, pos2)
	}
}

module.exports = Game
