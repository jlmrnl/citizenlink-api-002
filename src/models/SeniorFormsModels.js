const mongoose = require('mongoose');

const SeniorFormsModelSchema = new mongoose.Schema({
  typeOfApplication: {
    type: String,
    required: true,
    enum: ['New', 'Replacement']
  },
  idNumber: {
    type: Number
  },
  medicineBookletNumber: {
    type: Number
  },
  purchaseDTIbooklet: {
    type: Number
  },
  dateOfApplication: {
    type: Date,
    required: true
  },
  barangay: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  civilStatus: {
    type: String,
    enum: ['single', 'married', 'Other'],
    required: true
  },
  nationality: {
    type: String,
    enum: ['Filipino', 'Other']
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  placeOfBirth: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  picture: {
    type: String // Store the file path instead of using Buffer
  },
  contactPerson: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true
  }
});

const SeniorFormsModels = mongoose.model('SeniorFormsModels', SeniorFormsModelSchema);

module.exports = SeniorFormsModels;
