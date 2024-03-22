const mongoose = require("mongoose");

const SeniorFormsSchema = new mongoose.Schema({
  typeOfApplication: {
    type: String,
    required: true,
    enum: ["New", "Replacement"],
    default: "New",
  },
  oscaId: {
    type: Number,
    unique: true,
    maxlength: 4,
  },
  isAlive: {
    type: Boolean,
    default: true,
  },
  barangay: {
    type: String,
    enum: ["San Isidro Norte", "Baybay Lopez"],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  middleName: {
    type: String,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  suffix: {
    type: String,
    maxlength: 11,
  },
  age: {
    type: Number,
    required: true,
    max: 125,
    min: 60,
    maxlength: 3,
  },
  sex: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  civilStatus: {
    type: String,
    enum: ["single", "married", "Other"],
    required: true,
  },
  nationality: {
    type: String,
    enum: ["Filipino", "Other"],
  },
  dateOfBirth: {
    type: String,
  },
  placeOfBirth: {
    type: String,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    maxlength: 100,
  },
  contactPerson: {
    type: String,
    required: true,
    maxlength: 50,
  },
  contactNumber: {
    type: Number,
    required: true,
    maxlength: 11,
  },
  applicationStatus: {
    type: String,
    required: false,
    default: "pending",
    enum: [
      "pending",
      "on review",
      "incomplete",
      "not eligible",
      "eligible",
      "rejected",
      "approved",
      "updated",
    ],
  },
  createdBy: {
    type: String,
    ref: "lgu accounts",
  },
  picture: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "senior accounts",
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  userId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SeniorFormsModels = mongoose.model("senior records", SeniorFormsSchema);

module.exports = SeniorFormsModels;
