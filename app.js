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
    socket.on('status', (statusUpdate) => {
        if (statusUpdate.length[0] == 5) {
            socket.broadcast.emit('message', { title: 'Bingo!', text: statusUpdate.name + ' has gotten a bingo!' });
        } else if (statusUpdate.length[0] > 3) {
            socket.broadcast.emit('message', { title: 'Someone is getting close!', text: statusUpdate.name + ' almost has a bingo!' });
        }
        console.log(statusUpdate);
    });
});

app.get('/data', (req, res) => {
    res.json(
        bingo.bingo
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            .slice(0, 24)
    );
});

server.listen(3010, () => {
    console.log('listening on *:3010');
});
