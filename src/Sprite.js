import React, { useState, useEffect } from 'react'
import getDragListener from './DragListener'

const Sprite = ({ src }) => {
	const [snapped, setSnapped] = useState(true)
	const [dragging, setDragging] = useState(false)

	const [ref, setRef] = useState()
	useEffect(() => {
		setRef(React.createRef())
	}, [])

	const dragListener = getDragListener()
	const spriteUpdate = (x, y) => {
		ref.current.style.top = `${y - 32}px`
		ref.current.style.left = `${x - 32}px`
	}

	const snap = () => {
		setDragging(false)
		setSnapped(true)
	}
	return (
		<img
			className="noselect"
			onMouseDown={(e) => {
				dragListener.setSpriteUpdate(spriteUpdate, snap)
				spriteUpdate(e.clientX, e.clientY)
				setDragging(true)
			}}
			onMouseMove={() => {
				if (dragging) setSnapped(false)
			}}
			style={
				!snapped
					? {
							position: 'fixed',
							zIndex: '1',
							cursor: 'grabbing',
					  }
					: { cursor: 'grab' }
			}
			src={src}
			ref={ref}
			draggable="false"
			width="64"
			height="64"></img>
	)
}

export default Sprite