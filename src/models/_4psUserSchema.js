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
      email: {
        type: String,
        unique: true,
        required: true
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

const _4ps = mongoose.model('4ps accounts', citizenSchema);

module.exports = _4ps;