const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");
    // Return the port for server to listen on
    return process.env.PORT || 3000;
  } catch (err) {
    throw new Error(`Error connecting to MongoDB: ${err.message}`);
  }
}

module.exports = { connectToMongoDB };
