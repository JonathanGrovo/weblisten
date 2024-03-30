// Create a new room
const express = require('express');
const router = express.Router();
const Room = require('../models/roomSchema');

router.post('/rooms', async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).send(room);
    } catch (error) {
        res.status(400).send(error);
    }
});

// router export
module.exports = router;