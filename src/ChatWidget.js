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
	}, [])
	return (
		<>
			<div className="grow wordwrap" id="chat">
				{messages.map((msg, i) => (
					<p key={i}>
						{msg.from ? <strong> {msg.from + ':'} </strong> : null}{' '}
						{msg.content}
					</p>
				))}
			</div>
			<div id="input-row">
				<input id="chat-input" type="text" />
				<button id="send-button"> SEND </button>
			</div>
		</>
	)
}

export default ChatWidget
