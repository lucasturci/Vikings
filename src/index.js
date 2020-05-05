import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import io from 'socket.io-client'
import { getSocketContext } from './SocketContext';
import { path } from './constants.js'

const SocketContext = getSocketContext()
const socket = io(path)

ReactDOM.render(
    <SocketContext.Provider value={socket}>
        <App/>
    </SocketContext.Provider>,
    document.getElementById('root')
)