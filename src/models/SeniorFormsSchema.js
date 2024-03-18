const mongoose = require("mongoose");

const SeniorFormsSchema = new mongoose.Schema({
  typeOfApplication: {
    type: String,
    required: true,
    enum: ["New", "Replacement"],
    default: "New"
  },
  oscaId: {
    type: Number,
    unique: true
  },
  isAlive: {
    type: Boolean,
    default: true
  },
  barangay: {
    type: String,
    enum: ["San Isidro Norte", "Baybay Lopez"],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  suffix: {
    type: String
  },
  age: {
    type: Number,
    required: true,
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
  },
  address: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
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
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SeniorFormsModels = mongoose.model("senior records", SeniorFormsSchema);

module.exports = SeniorFormsModels;
