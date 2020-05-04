const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = 8081
http.listen(port, () => {
    console.log("Listening on port ", port)
})

io.on('connection', socket => {
    console.log('New user connected')
})

