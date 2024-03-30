const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const roomSchema = new mongoose.Schema({
    chat: [messageSchema],

    // general
    name: {
        type: String,
        required: true,
        trim: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    maxUsers: {
        type: Number,
        required: true,
        default: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // audio related
    songQueue: [
        {
            title: String,
            url: String, // url to the song
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            // additional song details
        }
    ],
    currentSongIndex: {
        type: Number,
        default: 0, // index of currently playing song in queue
    },
    playbackState: {
        type: String,
        enum: ['playing', 'paused', 'stopped'],
        default: 'stopped',
    },
    playbackPosition: {
        type: Number,
        default: 0, // current playback position in seconds
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;