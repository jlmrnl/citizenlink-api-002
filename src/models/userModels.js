const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     name: {
       type: String,
       required: false
     },
     userId: {
       type: Number,
       required: true
     },
     password: {
       type: String,
       required: true
     }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;