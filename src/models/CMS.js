const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema ({
    link: {
        type: String
    },
    description: {
        type: String,
        min: 100
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

const linkModel = mongoose.model('Links', linkSchema);

module.exports = linkModel;

