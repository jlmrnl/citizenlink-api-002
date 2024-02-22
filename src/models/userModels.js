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
     accessLevel: {
      type: String,
      required: true,
      enum: [
        'regional', 
        'municipal', 
        'barangay', 
        'citizen',
      ],
      default: 'citizen' // Default access level is 'citizen'
    },
     accountStatus: { // This is for account activation
      type: String,
      required: false,
      enum: [
        'active',
        'deactivated',
        'archived'
      ],
      default: 'active' // Default status is 'active'
     }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
