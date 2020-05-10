class Game {
	constructor(socketInstance, roomId) {
		this.max_players = 2
		this.players = []
		this.ready = [false, false]
		this.countReady = 0
		this.socketInstance = socketInstance
		this.roomId = roomId
		this.started = false
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
		this.socketInstance.to(this.players[1]).emit('YOU ARE PLAYER', 'B')
		this.socketInstance.to(this.players[1]).emit('YOUR TURN')
	}
}

module.exports = Game
