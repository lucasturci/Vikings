import React, { useEffect, useCallback, useState } from 'react'
import getDragListener from './DragListener'
import Cell from './Cell'
import { validTargets } from './GameUtils'
import './style.css'
import './game.css'

const boardBackground = [
	/* eslint-disable prettier/prettier */
	'C', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', 'C',
	'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
	'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
	'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
	'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
	'B', 'B', '.', 'W', 'W', 'C', 'W', 'W', '.', 'B', 'B',
	'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
	'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
	'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
	'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
	'C', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', 'C',
	/* eslint-enable prettier/prettier */
]

function insideBoard(x, y) {
	const rect = document.querySelector('#board').getBoundingClientRect()
	return (
		x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
	)
}

const Game = ({ gameState, gameId }) => {
	const dragListener = getDragListener()
	const [board] = useState([
		/* eslint-disable prettier/prettier */
		'.', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', '.',
		'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
		'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
		'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
		'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
		'B', 'B', '.', 'W', 'W', 'K', 'W', 'W', '.', 'B', 'B',
		'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
		'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
		'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
		'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
		'.', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', '.',
		/* eslint-enable prettier/prettier */
	])

	const [selectedCell, setSelectedCell] = useState(null)
	const [turn] = useState(true)
	const [suggestedMoves, setSuggestedMoves] = useState([])

	console.log(gameState)
	const makeMove = (pos1, pos2) => {
		console.log(`Making move fromm ${pos1} to ${pos2}`)
	}
	const drag = useCallback(
		(pos1, pos2) => {
			if (pos1 === pos2) {
				if (selectedCell) {
					makeMove(selectedCell, pos1)
					setSelectedCell(null)
				} else if (turn) {
					setSelectedCell(pos1)
					setSuggestedMoves(validTargets(board, pos1))
				}
			} else if (turn) {
				makeMove(pos1, pos2)
			}
		},
		[selectedCell, turn],
	)

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
	}, [])

	return (
		<div>
			<p className="statusMessage"> Game ID: {gameId} </p>

			<div
				id="board"
				onMouseDown={(e) => {
					const rect = document
						.querySelector('#board')
						.getBoundingClientRect()
					if (insideBoard(e.clientX, e.clientY)) {
						const x = Math.floor((e.clientX - rect.left) / 64)
						const y = Math.floor((e.clientY - rect.top) / 64)
						const id = y * 11 + x
						dragListener.startRecording(id)
					}
				}}
				onMouseUp={(e) => {
					const rect = document
						.querySelector('#board')
						.getBoundingClientRect()
					if (insideBoard(e.clientX, e.clientY)) {
						const x = Math.floor((e.clientX - rect.left) / 64)
						const y = Math.floor((e.clientY - rect.top) / 64)
						const id = y * 11 + x
						dragListener.stopRecording(id)
					} else {
						dragListener.cancelRecording()
					}
				}}>
				{board.map((x, i) => (
					<Cell
						id={i}
						value={x}
						key={i}
						back={boardBackground[i]}
						glowing={suggestedMoves.includes(i)}
					/>
				))}
			</div>
		</div>
	)
}

export default Game
