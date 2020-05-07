import React, { useState, useEffect, useContext } from 'react'
import Menu from './Menu'
import './style.css'
import Game from './Game'
/* import {useState, useContext, useCallback } from 'react' */

import { getSocketContext } from './SocketContext'

// Game States
const MENU = 'MENU'
const WAITING_OPPONENT = 'WAITING_OPPONENT'
const WAITING_READY = 'WAITING_READY'
// const PLAYING = 'PLAYING'
// const FINISHED = 'FINISHED'

const App = () => {
	const socket = useContext(getSocketContext())

	const [gameState, setGameState] = useState(MENU)
	const [gameId, setGameId] = useState(null)
	useEffect(() => {
		// SOCKET MESSAGES

		/* 
            Description: Sends a message that should be alerted to user
            What should we do?
            - Alert the message to the user
        */
		socket.on('ALERT_ERR', (msg) => {
			alert(`Error: ${msg}`)
		})

		/* 
            Description: Tells that user has successfully joined the room
            What should we do?
            - Change game state to WAITING_OPPONENT
            - Change window to game window
        */
		socket.on('JOINED', (gameId) => {
			setGameId(gameId)
			setGameState(WAITING_OPPONENT)
		})

		/* 
            Description: Tells the user that its opponent has already joined room and asks if you're ready to start
            What should we do?
            - Change game state to WAITING_READY
            - Enable 'READY' button in game, that if pressed emits a "READY!" message to server
        */
		socket.on('READY?', () => {
			setGameState(WAITING_READY)
		})
	}, [])

	const menu = (
		<div className="column">
			<h1> VIKINGS </h1>
			<Menu />
		</div>
	)

	const game = (
		<div className="column">
			<Game gameState={gameState} gameId={gameId} />
			<div className="column center-vertically">
				<button disabled={gameState !== WAITING_READY}>
					{gameState === WAITING_OPPONENT
						? 'Waiting for opponent'
						: "I'm ready!"}
				</button>
			</div>
		</div>
	)

	return gameState === MENU ? menu : game
}

export default App
