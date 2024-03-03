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
      name: {
        type: String
      },
      records: {
        type: mongoose.Schema.Types.ObjectId,
        ref: '4ps records'
      },
      role: {
        type: String,
        enum: ['citizen'],
        default: 'citizen'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }  
      
});

const Citizen = mongoose.model('4ps accounts', citizenSchema);

module.exports = Citizen;