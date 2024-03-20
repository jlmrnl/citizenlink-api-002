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
        type: String,
        maxlength: 50
      },
      records: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'senior records'
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

const Senior = mongoose.model('senior accounts', citizenSchema);

module.exports = Senior;