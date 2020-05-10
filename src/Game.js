import React, { useEffect, useState, useCallback } from 'react'
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

function insideBoard(x, y) {
	const rect = document.querySelector('#board').getBoundingClientRect()
	return (
		x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
	)
}

const Game = ({ gameState, gameId }) => {
	// State stuff
	const [board, setBoard] = useState(initialBoard)
	const [selectedCell, setSelectedCell] = useState(null)
	const [turn] = useState(false)
	const [player] = useState('W')
	const [suggestedMoves, setSuggestedMoves] = useState([])

	console.log(gameState)
	const makeMove = (pos1, pos2) => {
		console.log(`Making move from ${pos1} to ${pos2}`)
		setBoard((board) => swapPositionsOfBoard(board, pos1, pos2))
		console.log('Changing turn')
	}
	const drag = useCallback(
		(pos1, pos2) => {
			if (
				pos1 !== pos2 &&
				turn &&
				isMoveValid(board, player, pos1, pos2)
			) {
				makeMove(pos1, pos2)
				setSelectedCell(null)
				setSuggestedMoves([])
			}
		},
		[turn, board],
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

	const mouseDown = (e) => {
		let x = e.clientX
		let y = e.clientY
		const rect = document.querySelector('#board').getBoundingClientRect()
		if (insideBoard(x, y)) {
			x = Math.floor((x - rect.left) / 64)
			y = Math.floor((y - rect.top) / 64)
			const id = y * 11 + x

			if (
				!selectedCell ||
				!isMoveValid(board, player, selectedCell, id)
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
