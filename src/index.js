import React from 'react'
import ReactDOM from 'react-dom'

import io from 'socket.io-client'

console.log("Running webpack");

const socket = io('http://127.0.0.1:8081')
ReactDOM.render(<h1> Hello World </h1>, document.getElementById('root'))