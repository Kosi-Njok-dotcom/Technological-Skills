const mongoose = require('mongoose')
const dns = require('dns')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log ("mongoose connected")
    }
    catch (error){
        console.error(error);
        // Process.exit(1);
    }
}

module.exports = connectDB