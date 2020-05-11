import React, { useContext, useCallback } from 'react'
import './style.css'
import { getSocketContext } from './SocketContext'
const Menu = () => {
	const socket = useContext(getSocketContext())

	const createRoom = useCallback(() => {
		console.log('Emitting event CREATE_ROOM')
		socket.emit('CREATE_ROOM')
	}, [socket])

	const joinRoom = useCallback(
		(e) => {
			if (e.key === 'Enter') {
				console.log('Emitting event JOIN')
				const value = document.getElementById('joinRoomInput').value
				socket.emit('JOIN', value)
			}
		},
		[socket],
	)

	return (
		<div className="column center-vertically">
			<button onClick={() => createRoom()} className="up20 btn">
				NEW GAME
			</button>
			<p className="up20 mt2"> Or enter existing: </p>
			<input
				id="joinRoomInput"
				onKeyDown={(e) => joinRoom(e)}
				className="up20 ph2"
				type="text"
				placeholder="Game ID"
			/>
		</div>
	)
}

export default Menu
