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

	const makeMove = useCallback(
		(pos1, pos2) => {
			console.log(`Making move from ${pos1} to ${pos2}`)
		},
		[gameState],
	)
	useEffect(() => {
		dragListener.setCallback(makeMove)
	}, [makeMove])

	return (
		<div>
			<p className="statusMessage"> Game ID: {gameId} </p>

			<div id="board">
				{board.map((x, i) => (
					<Cell id={i} value={x} key={i} back={boardBackground[i]} />
				))}
			</div>
		</div>
	)
}

export default Game
