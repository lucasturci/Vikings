import React from 'react'
import getDragListener from './DragListener'
import './style.css'
import './game.css'

import BlankCell from '../assets/blank-cell.svg'
import CastleCell from '../assets/castle-cell.svg'
import WhiteCell from '../assets/white-cell.svg'
import BlackCell from '../assets/black-cell.svg'

import BlackPiece from '../assets/black-piece.svg'
import WhitePiece from '../assets/white-piece.svg'
import KingPiece from '../assets/king-piece.svg'

const Cell = ({ id, value, back }) => {
	const dragListener = getDragListener()

	console.log(back)
	return (
		<div
			className={`cell noselect`}
			onMouseDown={() => dragListener.startRecording(id)}
			onMouseUp={() => dragListener.stopRecording(id)}
			style={{
				backgroundImage:
					back === '.'
						? `url(${BlankCell})`
						: back === 'C'
						? `url(${CastleCell})`
						: back === 'W'
						? `url(${WhiteCell})`
						: `url(${BlackCell})`,
			}}>
			{value !== '.' ? (
				<img
					src={
						value == 'W'
							? WhitePiece
							: value === 'B'
							? BlackPiece
							: KingPiece
					}
					width="64"
					height="64"></img>
			) : null}
		</div>
	)
}

export default Cell
