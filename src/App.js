import React, { useState, useEffect, useContext } from 'react'
import Menu from './Menu'
import './style.css'
import Game from './Game'
import ChatWidget from './ChatWidget'
/* import {useState, useContext, useCallback } from 'react' */

import { getSocketContext } from './SocketContext'

// Game States
const MENU = 'MENU'
const WAITING_OPPONENT = 'WAITING_OPPONENT'
const WAITING_READY = 'WAITING_READY'
const PLAYING = 'PLAYING'
// const FINISHED = 'FINISHED'

const App = () => {
	const socket = useContext(getSocketContext())

	const [ready, setReady] = useState(false)
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

		/* 
			Description: When both players are ready, server emits a 'STARTING' message, which indicates 
			that the game has started
            What should we do?
            - Change game state to PLAYING
            - From this point on, who handles the communication with the socket is the Game Component
        */
		socket.on('STARTING', () => {
			setGameState(PLAYING)
		})
	}, [])

	const sendReady = () => {
		setReady(true)
		socket.emit('READY!', gameId)
	}

	const menu = (
		<div className="column">
			<h1> VIKINGS </h1>
			<Menu />
		</div>
	)

	const game = (
		<div id="game-container">
			<Game gameState={gameState} gameId={gameId} />
			<div id="sidebar">
				<button
					className="btn"
					disabled={gameState !== WAITING_READY || ready}
					onClick={() => sendReady()}>
					{gameState === WAITING_OPPONENT
						? 'Waiting for opponent'
						: gameState === WAITING_READY
						? "I'm ready!"
						: 'GO!'}
				</button>

				<ChatWidget />
			</div>
		</div>
	)

	return gameState === MENU ? menu : game
}

export default App
