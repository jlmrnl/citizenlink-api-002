const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema ({
    link: {
        type: String,
        maxlength: 255
    },
    description: {
        type: String,
        maxlength: 100
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

const linkModel = mongoose.model('Links', linkSchema);

module.exports = linkModel;

