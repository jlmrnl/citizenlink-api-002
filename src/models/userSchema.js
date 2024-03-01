const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     
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
     profile: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Profile'
     }
});

const userModel = mongoose.model('Accounts', userSchema);

module.exports = userModel;
