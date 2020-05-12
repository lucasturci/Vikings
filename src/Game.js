import React, { useEffect, useState, useContext } from 'react'
import getDragListener from './DragListener'
import Cell from './Cell'
import {
	validTargets,
	isMoveValid,
	swapPositionsOfBoard,
	initialBoard,
	boardBackground,
} from './GameUtils'
import './style.css'
import './game.css'
import { getSocketContext } from './SocketContext'
import LightOn from '../assets/light-on.svg'

function insideBoard(x, y) {
	const rect = document.querySelector('#board').getBoundingClientRect()
	return (
		x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
	)
}

const Game = ({ gameState, gameId }) => {
	// State stuff
	const [board, setBoard] = useState(new Array(121).fill('.'))
	const [lastMove, setLastMove] = useState([]) // stores the two cells of the last move
	const [selectedCell, setSelectedCell] = useState(null)
	const [turn, setTurn] = useState(false)
	const [player, setPlayer] = useState('W')
	const [suggestedMoves, setSuggestedMoves] = useState([])

	const socket = useContext(getSocketContext())

	console.log(gameState)
	const makeMove = (pos1, pos2) => {
		console.log(`Making move from ${pos1} to ${pos2}`)
		socket.emit('MOVE', board, pos1, pos2)
		setBoard((board) => swapPositionsOfBoard(board, pos1, pos2))
		console.log('Changing turn')
		setTurn(false)
		setLastMove([])
	}
	const drag = (pos1, pos2) => {
		if (pos1 !== pos2 && turn && isMoveValid(board, player, pos1, pos2)) {
			makeMove(pos1, pos2)
			setSelectedCell(null)
			setSuggestedMoves([])
		}
	}

	const dragListener = getDragListener()
	useEffect(() => {
		dragListener.setCallback(drag)
	}, [selectedCell, turn])
	useEffect(() => {
		document.body.addEventListener('click', (e) => {
			if (!insideBoard(e.clientX, e.clientY)) {
				setSelectedCell(null)
				setSuggestedMoves([])
			}
		})
		dragListener.setCallback(drag)

		// SOCKET STUFF

		socket.on('STARTING', () => {
			setBoard(initialBoard)
			setLastMove([])
		})

		socket.on('YOU ARE PLAYER', (p) => {
			setPlayer(p)
		})

		socket.on('UPDATE BOARD', (board) => {
			setBoard(board)
		})

		socket.on('UPDATE LAST MOVE', (pos1, pos2) => {
			setLastMove([pos1, pos2])
		})
		socket.on('UPDATE TURN', (turn) => {
			setTurn(turn)
		})
	}, [])

	const mouseDown = (e) => {
		let x = e.clientX
		let y = e.clientY
		const rect = document.querySelector('#board').getBoundingClientRect()
		const cellSize = window.matchMedia('(max-width: 768px)').matches
			? 25
			: 64
		if (insideBoard(x, y)) {
			x = Math.floor((x - rect.left) / cellSize)
			y = Math.floor((y - rect.top) / cellSize)
			const id = y * 11 + x

			if (
				turn &&
				(!selectedCell || !isMoveValid(board, player, selectedCell, id))
			) {
				setSuggestedMoves(validTargets(board, player, id))
				setSelectedCell(id)
			}

			dragListener.startRecording(id)
		}
	}
	const mouseUp = (e) => {
		let x = e.clientX
		let y = e.clientY
		const rect = document.querySelector('#board').getBoundingClientRect()
		const cellSize = window.matchMedia('(max-width: 768px)').matches
			? 25
			: 64
		if (insideBoard(x, y)) {
			x = Math.floor((x - rect.left) / cellSize)
			y = Math.floor((y - rect.top) / cellSize)
			const id = y * 11 + x
			dragListener.stopRecording(id)
		} else {
			dragListener.cancelRecording()
		}
	}

	const cellClick = (id) => {
		if (turn) {
			setSuggestedMoves(validTargets(board, player, id))
			if (selectedCell && isMoveValid(board, player, selectedCell, id)) {
				makeMove(selectedCell, id)
				setSelectedCell(null)
			} else {
				setSelectedCell(id)
			}
		}
	}

	return (
		<div>
			<p className="statusMessage">
				<span>Game ID: {gameId}</span>
				{turn ? <img src={LightOn}></img> : null}
			</p>

			<div
				id="board"
				onMouseDown={(e) => mouseDown(e)}
				onMouseUp={(e) => mouseUp(e)}>
				{board.map((x, i) => (
					<Cell
						id={i}
						value={x}
						key={i}
						back={boardBackground[i]}
						onClick={() => cellClick(i)}
						glowing={suggestedMoves.includes(i)}
						lastMove={lastMove.includes(i)}
					/>
				))}
			</div>
		</div>
	)
}

export default Game
