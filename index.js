const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = 8081
const webport = 80
http.listen(port, () => {
    console.log("Listening for socket connections on port", port)
})

app.listen(webport, () => {
    console.log("Listening for static web files on port", webport)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/static/bundle.js', (req, res) => {
    res.sendFile(__dirname + '/dist/bundle.js')
})

io.on('connection', socket => {
    console.log('New user connected')
    
    socket.on('chat message', msg => {
        console.log(`New chat message: ${msg}`)
        io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})

