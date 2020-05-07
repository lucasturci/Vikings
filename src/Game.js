import React from 'react'

const Game = ({ gameState, gameId }) => {
	console.log(gameState)
	console.log(gameId)

	return (
		<div>
			<p className="statusMessage"> Game ID: {gameId} </p>
		</div>
	)
}

export default Game
