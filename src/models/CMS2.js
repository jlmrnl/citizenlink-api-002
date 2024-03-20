const mongoose = require("mongoose");

const linkSchema2 = new mongoose.Schema({
  link: {
    type: String,
    maxlength: 255,
  },
  description: {
    type: String,
    maxlength: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const linkModel2 = mongoose.model("Links2", linkSchema2);

module.exports = linkModel2;
