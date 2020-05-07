import React from 'react'
import getDragListener from './DragListener'
import './style.css'
import './game.css'

import BlankCell from '../assets/blank-cell.svg'
import CastleCell from '../assets/castle-cell.svg'
import WhiteCell from '../assets/white-cell.svg'

const Cell = ({ id, back }) => {
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
						: `url(${WhiteCell})`,
			}}></div>
	)
}

export default Cell
