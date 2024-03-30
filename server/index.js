const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectToMongoDB } = require('./db');
const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

const app = express();
app.use(express.json()); // to parse json request bodies

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    // handle room creation event
    socket.on('createRoom', async (roomData) => {
        try {
            const room = new Room(roomData); // create new room using model
            await room.save(); // save room to database
            io.emit('roomCreated', room); // broadcast new room to all clients
        } catch (error) {
            socket.emit('errorCreatingRoom', error.message); // send an error message back to the client
        }
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    try {
        const db = await connectToMongoDB();
        // db instance can be used here for db operations
        console.log(`Server listening on port ${PORT}`);
    } catch (err) {
        console.error('Failed to start the server:', err);
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to my application!');
});