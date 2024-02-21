const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     name: {
       type: String,
       required: false
     },
     userId: {
       type: String,
       required: true,
       unique: true
     },
     password: {
       type: String,
       required: true
     },
     role: { // This is for the access control
      required: false,
      type: String,
      enum: [
        'regional',
        'municipal',
        'barangay',
        'citizen'
      ]
     },
     accountStatus: { // This is for account activation
      type: String,
      enum: [
        'active',
        'deactivated',
        'archived'
      ]
     }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;