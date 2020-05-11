import React, { useContext, useEffect, useState } from 'react'
import { getSocketContext } from './SocketContext'

const ChatWidget = () => {
	const socket = useContext(getSocketContext())

	const [messages, setMessages] = useState([])

	useEffect(() => {
		socket.on('STARTING', () => {
			setMessages((messages) =>
				messages.concat({
					from: null,
					content: 'Game has started!',
				}),
			)
		})

		socket.on('CHAT MESSAGE', (msg) => {
			setMessages((messages) => messages.concat(msg))
		})
	}, [])

	const sendMessage = () => {
		const value = document.querySelector('#chat-input').value
		document.querySelector('#chat-input').value = ''
		if (value) {
			socket.emit('CHAT MESSAGE', value)
		}
		setMessages((messages) =>
			messages.concat({
				from: 'You',
				content: value,
			}),
		)
	}
	return (
		<>
			<div className="grow wordwrap" id="chat">
				{messages.map((msg, i) => (
					<p key={i}>
						{msg.from ? <strong> {msg.from + ':'} </strong> : null}{' '}
						{msg.from ? msg.content : <i> {msg.content}</i>}
					</p>
				))}
			</div>
			<div id="input-row">
				<input
					id="chat-input"
					type="text"
					onKeyDown={(e) => {
						if (e.key === 'Enter') sendMessage()
					}}
				/>
				<button id="send-button" onClick={() => sendMessage()}>
					SEND
				</button>
			</div>
		</>
	)
}

export default ChatWidget
