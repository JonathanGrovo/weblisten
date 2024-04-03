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
        // for creating the user
        if (roomData.createUser) {
            user = new User({ username: generateRandomUsername() });
            await user.save();
        }
        let room = new Room({ ...roomData, createdBy: user._id });
        await room.save();
        
        // for adding the creator to the room
        if (user) {
            room = await Room.findByIdAndUpdate(
                room._id,
                { $addToSet: { users: user._id } },
                { new: true }
            );
        }
        io.emit('roomCreated', { room, user }); // Send back both room and user info
        } catch (error) {
        socket.emit('errorCreatingRoom', error.message);
        }
    });

    // handle join room event
    socket.on('joinRoom', async (joinData) => {
        console.log('Received joinRoom event:', joinData);
        try {
            let user = await User.findById(joinData.userId);
            if (!user) {
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

    // handle request for room information
    socket.on('requestRoomDetails', async (data) => {
        const roomId = data.roomId;
        // fetch the room details from data store
        const room = await Room.findById(roomId);
        console.log('Sending room details:', room);
        socket.emit('roomDetails', { room }); // send back room details
    })

    // handle reconnect room event
    socket.on('reconnectRoom', async (userId) => {
        console.log('User reconnecting:', userId);
        const user = await User.findById(userId);
        if (user) {
            const room = await Room.findOne({ users: user._id });
            if (room) {
                console.log('Restoring room state for user:', room);
                socket.emit('restoreRoomState', { room, user });
            }
        }
    });

    // handle leave room event
    socket.on('leaveRoom', ({ userId, roomId }) => {
        removeUserFromRoom(userId, roomId);
    });

    socket.on('disconnect', () => {
        const userId = socket.userId;
        const roomId = socket.roomId;
        removeUserFromRoom(userId, roomId);
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

// for generating the initial username of the user
function generateRandomUsername() {
    const prefix = 'User';
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${prefix}${randomNumber}`;
}

// for removing the user from the room
function removeUserFromRoom(userId, roomId) {
    Room.updateOne(
        { _id: roomId },
        { $pull: { users: userId } } // remove the user from the users array
    )
    .then(() => {
        console.log(`User ${userId} removed from room ${roomId}`);
        // emit an event to inform other users in the room
        io.to(roomId).emit('userLeft', { userId: userId });
    })
    .catch((error) => {
        console.error(`Error removing user ${userId} from room ${roomId}:`, error);
    });
}