import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import io from 'socket.io-client'
import { getSocketContext } from './SocketContext';

const SocketContext = getSocketContext()

const port = 8081
const path = `http://127.0.0.1:${port}`

const socket = io(path)

ReactDOM.render(
    <SocketContext.Provider value={socket}>
        <App/>
    </SocketContext.Provider>,
    document.getElementById('root')
)