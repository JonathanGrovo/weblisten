const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;