const mongoose = require('mongoose');

const uri = "mongodb+srv://jonathangrovo:QD5q5IhtZ7PQAhXZ@weblisten.1kqhjr9.mongodb.net/?retryWrites=true&w=majority&appName=weblisten";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }
};

module.exports = { connectToMongoDB };