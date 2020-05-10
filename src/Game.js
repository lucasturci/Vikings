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
	// State stuff
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

	const drag = useCallback(
		(pos1, pos2) => {
			if (pos1 != pos2 && turn) {
				makeMove(pos1, pos2)
			}
		},
		[selectedCell, turn],
	)

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
	}, [])

	console.log(gameState)
	const makeMove = (pos1, pos2) => {
		console.log(`Making move from ${pos1} to ${pos2}`)
	}

	const mouseDown = (e) => {
		let x = e.clientX
		let y = e.clientY
		const rect = document.querySelector('#board').getBoundingClientRect()
		if (insideBoard(x, y)) {
			x = Math.floor((x - rect.left) / 64)
			y = Math.floor((y - rect.top) / 64)
			const id = y * 11 + x
			setSuggestedMoves(validTargets(board, id))
			dragListener.startRecording(id)
		}
	}
	const mouseUp = (e) => {
		let x = e.clientX
		let y = e.clientY
		const rect = document.querySelector('#board').getBoundingClientRect()
		if (insideBoard(x, y)) {
			x = Math.floor((x - rect.left) / 64)
			y = Math.floor((y - rect.top) / 64)
			const id = y * 11 + x
			dragListener.stopRecording(id)
		} else {
			dragListener.cancelRecording()
		}
	}

	const cellClick = (id) => {
		setSuggestedMoves(validTargets(board, id))
		if (selectedCell) {
			makeMove(selectedCell, id)
			setSelectedCell(null)
		} else if (turn) {
			setSelectedCell(id)
		}
	}

	return (
		<div>
			<p className="statusMessage"> Game ID: {gameId} </p>

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
					/>
				))}
			</div>
		</div>
	)
}

export default Game
