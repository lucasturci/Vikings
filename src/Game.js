import React, { useEffect, useCallback, useState } from 'react'
import getDragListener from './DragListener'
import Cell from './Cell'
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
				}
			} else if (turn) {
				makeMove(pos1, pos2)
			}
		},
		[selectedCell, turn],
	)
	useEffect(() => {
		dragListener.setCallback(drag)
	}, [makeMove])

	return (
		<div>
			<p className="statusMessage"> Game ID: {gameId} </p>

			<div
				id="board"
				onMouseDown={(e) => {
					const rect = document
						.querySelector('#board')
						.getBoundingClientRect()
					if (
						e.clientX >= rect.left &&
						e.clientX <= rect.right &&
						e.clientY >= rect.top &&
						e.clientY <= rect.bottom
					) {
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
					if (
						e.clientX >= rect.left &&
						e.clientX <= rect.right &&
						e.clientY >= rect.top &&
						e.clientY <= rect.bottom
					) {
						const x = Math.floor((e.clientX - rect.left) / 64)
						const y = Math.floor((e.clientY - rect.top) / 64)
						const id = y * 11 + x
						dragListener.stopRecording(id)
					} else {
						dragListener.cancelRecording()
					}
				}}>
				{board.map((x, i) => (
					<Cell id={i} value={x} key={i} back={boardBackground[i]} />
				))}
			</div>
		</div>
	)
}

export default Game
