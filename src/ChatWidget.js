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

		socket.on('GAME MESSAGE', (msg) => {
			setMessages((messages) =>
				messages.concat({
					from: null,
					content: msg,
				}),
			)
		})

		socket.on('GAME OVER', (won) => {
			setMessages((messages) =>
				messages.concat({
					from: null,
					content: won ? 'You won!' : 'You lost!',
				}),
			)
		})
	}, [])

	useEffect(() => {
		document.getElementById(
			'wrappedChat',
		).scrollTop = document.getElementById('wrappedChat').scrollHeight
	}, [messages])

	// Makes the command and tells if the command should not appear as a chat message
	const command = (value) => {
		const commands = {
			'\\undo': () => {
				socket.emit('UNDO')
				return false // should appear as chat message
			},

			'\\swap': () => {
				socket.emit('SWAP')
				return true // should not appear as chat message
			},

			'\\gg': () => {
				socket.emit('GG')
				return true // should not appear as chat message
			},
		}
		if (Object.keys(commands).includes(value)) {
			return commands[value]()
		}
		return false
	}
	const sendMessage = () => {
		const value = document.querySelector('#chat-input').value
		document.querySelector('#chat-input').value = ''

		if (command(value)) return

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
				<div
					id="wrappedChat"
					style={{
						overflowY: 'scroll',
						width: '100%',
						height: '100%',
						flexGrow: '0',
					}}>
					{messages.map((msg, i) => (
						<p key={i}>
							{msg.from ? (
								<strong> {msg.from + ':'} </strong>
							) : null}{' '}
							{msg.from ? msg.content : <i> {msg.content}</i>}
						</p>
					))}
				</div>
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
