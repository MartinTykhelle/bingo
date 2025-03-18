const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const bingo = require('./bingo.json');

app.use(express.static(path.resolve('frontend', 'dist')));

io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/data', (req, res) => {
    res.json(
        bingo.bingo
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            .slice(23)
    );
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
