import React from 'react'
import {useState, useContext, useCallback } from 'react'
import { getSocketContext } from './SocketContext';

const App = () => {
    const [chat, setChat] = useState([])
    const socket = useContext(getSocketContext())

    const sendMessage = useCallback(() => {
        const input = document.getElementById('message')
        const message = input.value
    
        socket.emit('chat message', message)
    }, [socket])

    socket.on('chat message', msg => {
        setChat(chat.concat(msg))
    })


    return <div>
        <input id='message' type='text' />
        <button onClick={() => sendMessage()}> Enviar </button>

        <div>
            {chat.map(msg => <p> {msg} </p>)}
        </div>
    </div>
}

export default App