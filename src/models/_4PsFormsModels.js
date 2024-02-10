const mongoose = require('mongoose');

const _4PsFormsModelSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  middlename: {
    type: String
  },
  suffix: {
    type: String
  },
  houseNumber: {
    type: Number,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  barangay: {
    type: String,
    enum: ['San Isidro Norte', 'San Isidro Sur'],
    required: true
  },
  cityMunicipality: {
    type: String,
    default: 'Binmaley',
    required: true
  },
  province: {
    type: String,
    enum: ['Pangasinan'],
    required: true
  },
  region: {
    type: String,
    enum: ['Region 1'],
    required: true
  },
  postal: {
    type: String,
    default: '2431',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  applicationStatus: {
    type: String,
    required: false,
    default: 'pending',
    enum: [
      'pending',
      'on review',
      'incomplete',
      'not eligigle'
      'eligible',
      'rejected',
      'approved'
    ]
  }
});

const _4PsFormsModel = mongoose.model('4PsFormsModel', _4PsFormsModelSchema);

module.exports = _4PsFormsModel;
