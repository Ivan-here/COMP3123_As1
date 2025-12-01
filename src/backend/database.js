const mongoose = require('mongoose');

const MONGO_URI =
    'mongodb+srv://admin:admin@cluster0.jxwakj7.mongodb.net?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI, { dbName: 'comp3123_assigment1' });
    console.log('MongoDB connected (Atlas)');
};

module.exports = { connectDB };