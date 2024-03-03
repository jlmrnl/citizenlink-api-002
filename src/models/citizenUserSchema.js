const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      name: String
});

const Citizen = mongoose.model('Citizen', citizenSchema);

module.exports = Citizen;