const mongoose = require('mongoose');

const uri = "mongodb+srv://jonathangrovo:QD5q5IhtZ7PQAhXZ@weblisten.1kqhjr9.mongodb.net/?retryWrites=true&w=majority&appName=weblisten";
// const client = new MongoClient(uri);

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        // return client.db('weblisten'); // Return the database instance
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
    }
};

module.exports = { connectToMongoDB };