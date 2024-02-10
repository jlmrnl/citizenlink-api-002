const mongoose = require('mongoose');

const userSchema = mongoose.model({
     name: {
       type: String,
       required: false
    },
     userId: {
       type: int,
       required: true
    },
     password: {
       type: String,
       required: true
    }
)};

const userSchema = mongoose.schema({

)}

export userSchema