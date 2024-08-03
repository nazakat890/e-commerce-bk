
const mongoose = require('mongoose');
require('dotenv').config;

mongoose.set('strictQuery', true)


const connectDB = async (url) => {
    try {
        await mongoose.connect(url, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB connected')
    }
    catch(error) {
        console.log('MongoDB connection error', error.message)
     process.exit(1)
    }
}
module.exports = connectDB;

