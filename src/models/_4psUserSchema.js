const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        immutable: true
      },
      password: {
        type: String,
        required: true,
        maxlength: 100
      },
      name: {
        type: String,
        maxlength: 50
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
        default: Date.now,
        immutable: true
      }  
      
});

const _4ps = mongoose.model('4ps accounts', citizenSchema);

module.exports = _4ps;