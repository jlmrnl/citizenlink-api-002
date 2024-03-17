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
     email: {
      type: String,
      unique: true,
      required: true
    },
     profile: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'lgu profiles'
     },
     createdAt: {
       type: Date,
       default: Date.now
     }  
});

const userModel = mongoose.model('lgu accounts', userSchema);

module.exports = userModel;
