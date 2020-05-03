const express = require('express');
const app = express();

const http = require('http').Server(app)

const port = 3000;
http.listen(port, () => {
    console.log("Listening on port ", port)
})

app.get('/', (req, res) => {
    res.send("Hello World")
})