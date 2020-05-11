import React from 'react'

const ChatWidget = () => {
	return (
		<>
			<div className="grow" id="chat"></div>
			<div id="input-line">
				<input id="chat-input" type="text" />
				<button id="send-button"> SEND </button>
			</div>
		</>
	)
}

export default ChatWidget
