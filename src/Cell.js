import React from 'react'
import Sprite from './Sprite'
import './style.css'
import './game.css'

import BlankCell from '../assets/blank-cell.svg'
import CastleCell from '../assets/castle-cell.svg'
import WhiteCell from '../assets/white-cell.svg'
import BlackCell from '../assets/black-cell.svg'

import BlackPiece from '../assets/black-piece.svg'
import WhitePiece from '../assets/white-piece.svg'
import KingPiece from '../assets/king-piece.svg'

const Cell = ({ value, back, onClick, glowing, lastMove }) => {
	return (
		<div
			className={`cell noselect ${glowing ? 'glowing' : ''} ${
				lastMove && !glowing ? 'lastmove' : ''
			}`}
			style={{
				backgroundImage:
					back === '.'
						? `url(${BlankCell})`
						: back === 'C'
						? `url(${CastleCell})`
						: back === 'W'
						? `url(${WhiteCell})`
						: `url(${BlackCell})`,
			}}
			onClick={onClick}>
			<div style={{ position: 'relative' }}>
				{value !== '.' ? (
					<Sprite
						src={
							value == 'W'
								? WhitePiece
								: value === 'B'
								? BlackPiece
								: KingPiece
						}
					/>
				) : null}
			</div>
		</div>
	)
}

export default Cell
