import React from 'react'
import getDragListener from './DragListener'
import './style.css'
import './game.css'

const Cell = ({ id, value }) => {
	const dragListener = getDragListener()

	console.log((id % 8) + Math.floor(id / 8))
	return (
		<div
			className={`cell noselect ${
				((id % 8) + Math.floor(id / 8)) % 2 === 1 ? 'white' : 'black'
			}`}
			onMouseDown={() => dragListener.startRecording(id)}
			onMouseUp={() => dragListener.stopRecording(id)}>
			{value}
		</div>
	)
}

export default Cell
