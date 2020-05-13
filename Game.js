const {
	initialBoard,
	swapPositionsOfBoard,
	checksEaten,
	checkGameOver,
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
		this.history = []
		this.lastMove = null
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

	pushToHistory(board, turn, lastMove) {
		this.history.push({ board, turn, lastMove })
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

		this.socketInstance.to(this.players[1]).emit('UPDATE TURN', true)

		this.history = []
		this.board = initialBoard
		this.turn = 1
		this.lastMove = null
	}

	/* Game is over
	 * - Emit messages to the players sending who won and who lost
	 * - Clears stuff for next game
	 */
	gameOver(winner) {
		this.socketInstance.to(this.players[winner]).emit('GAME OVER', true)
		this.socketInstance
			.to(this.players[1 - winner])
			.emit('GAME OVER', false)

		// Clear stuff for next game
		this.started = false
		this.players = [this.players[1], this.players[0]] // swap the two players
		this.ready = [false, false]
	}

	/*
		Emits messages to update the clients
	*/
	update() {
		this.socketInstance.in(this.roomId).emit('UPDATE BOARD', this.board)
		if (this.lastMove)
			this.socketInstance
				.to(this.players[this.turn])
				.emit('UPDATE LAST MOVE', this.lastMove[0], this.lastMove[1])
		this.socketInstance
			.to(this.players[1 - this.turn])
			.emit('UPDATE LAST MOVE', null)

		this.socketInstance
			.to(this.players[1 - this.turn])
			.emit('UPDATE TURN', false)
		this.socketInstance
			.to(this.players[this.turn])
			.emit('UPDATE TURN', true)
	}

	/*
		Undoes the last move
	*/
	undo() {
		if (this.history.length === 0) return
		const last = this.history.pop()

		this.board = last.board
		this.lastMove = last.lastMove
		this.turn = last.turn

		this.update()
	}

	/*
		Swaps the black player with the white player
	*/
	swap() {
		// Can only be triggered when game has already started
		if (this.started) {
			// swap the players
			const aux = this.players[0]
			this.players[0] = this.players[1]
			this.players[1] = aux

			this.update()

			this.socketInstance
				.in(this.roomId)
				.emit('GAME MESSAGE', 'Swapping the characters')
			this.socketInstance.to(this.players[0]).emit('YOU ARE PLAYER', 'W')
			this.socketInstance
				.to(this.players[0])
				.emit('GAME MESSAGE', 'You are the defender!')
			this.socketInstance.to(this.players[1]).emit('YOU ARE PLAYER', 'B')
			this.socketInstance
				.to(this.players[1])
				.emit('GAME MESSAGE', 'You are the attacker!')
			this.socketInstance.to(this.players[1])
		}
	}

	/*
		Is called when an user gives up and doesn't wanna wait for the game to end
	*/
	forfeit(id) {
		if (this.started === false) return // just ignore
		const player = this.players.indexOf(id)
		this.socketInstance
			.in(this.roomId)
			.emit('GAME MESSAGE', `User ${id.substr(0, 3)} gives up`)
		this.gameOver(1 - player)
	}

	// Returns new board after the move pos1 => pos2
	// Assumes the move is valid, and just updates the board accordingly and checks if someone won or a draw happened (?)
	move(board, pos1, pos2) {
		if (!this.started) {
			console.log('ERROR! Received move when game is not started')
		}

		this.pushToHistory(this.board, this.turn, this.lastMove)

		this.board = swapPositionsOfBoard(board, pos1, pos2)
		if (checksEaten(this.board, pos2 + 1, pos2)) {
			if (this.board[pos2 + 1] !== 'K') this.board[pos2 + 1] = '.'
		}
		if (checksEaten(this.board, pos2 - 1, pos2)) {
			if (this.board[pos2 - 1] !== 'K') this.board[pos2 - 1] = '.'
		}
		if (checksEaten(this.board, pos2 + 11, pos2)) {
			if (this.board[pos2 + 11] !== 'K') this.board[pos2 + 11] = '.'
		}
		if (checksEaten(this.board, pos2 - 11, pos2)) {
			if (this.board[pos2 - 11] !== 'K') this.board[pos2 - 11] = '.'
		}

		// WILL CHECK IF GAME IS OVER
		const over = checkGameOver(this.board)
		if (over) {
			// game is over
			if (over === 1) {
				// white won
				this.gameOver(0)
			} else {
				// black won
				this.gameOver(1)
			}
		}

		this.turn = 1 - this.turn
		this.lastMove = [pos1, pos2]
		this.socketInstance.in(this.roomId).emit('UPDATE BOARD', this.board)
		this.socketInstance
			.to(this.players[this.turn])
			.emit('UPDATE LAST MOVE', pos1, pos2)
		if (!over)
			// If game is not over, send the turn to next player
			this.socketInstance
				.to(this.players[this.turn])
				.emit('UPDATE TURN', true)
	}
}

module.exports = Game
