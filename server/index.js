const express = require('express');
// for allowing cross origin resource sharing
const cors = require('cors');

// for initial db connection
const { connectToMongoDB } = require('./db');

// schema includes
const Room = require('./models/roomSchema');
const User = require('./models/userSchema');

// Set up CORS options for express server
const corsOptions = {
    origin: 'http://localhost:8080', // allow requests from Vue.js app
}

const app = express();
app.use(express.json()); // to parse json request bodies
app.use(cors(corsOptions)) // use CORS middleware

// socket.io setup and cors config
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:8080', // Allow WebSocket connections from your Vue.js application
      methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    // handle create room event
    socket.on('createRoom', async (roomData) => {
        try {
        let user;
        if (roomData.createUser) {
            user = new User({ username: generateRandomUsername() });
            await user.save();
        }
        const room = new Room({ ...roomData, createdBy: user._id });
        await room.save();
        io.emit('roomCreated', { room, user }); // Send back both room and user info
        } catch (error) {
        socket.emit('errorCreatingRoom', error.message);
        }
    });

    // handle join room event
    socket.on('joinRoom', async (joinData) => {
        try {
        let user;
        if (joinData.createUser) {
            user = new User({ username: generateRandomUsername() });
            await user.save();
        }
        const room = await Room.findByIdAndUpdate(
            joinData.roomId,
            { $addToSet: { users: user._id } },
            { new: true }
        );
        io.emit('userJoinedRoom', { room, user }); // Send back updated room and user info
        } catch (error) {
        socket.emit('errorJoiningRoom', error.message);
        }
    });
  
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

function generateRandomUsername() {
    const prefix = 'User';
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${prefix}${randomNumber}`;
}