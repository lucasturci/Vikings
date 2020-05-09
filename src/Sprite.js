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

	const mouseDown = (e, isMobile) => {
		const x = isMobile
			? e.touches[0].pageX ||
			  e.changedTouches[0].pageX ||
			  e.targetTouches[0].pageY
			: e.clientX
		const y = isMobile
			? e.touches[0].pageY ||
			  e.changedTouches[0].pageY ||
			  e.targetTouches[0].pageY
			: e.clientY
		dragListener.setSpriteUpdate(spriteUpdate, snap)
		spriteUpdate(x, y)
		setDragging(true)
	}
	const mouseMove = () => {
		if (dragging) setSnapped(false)
	}
	return (
		<img
			className="noselect"
			onMouseDown={(e) => mouseDown(e, false)}
			onTouchStart={(e) => mouseDown(e, true)}
			onMouseMove={mouseMove}
			onTouchMove={mouseMove}
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
