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
  sex:{
    type: String,
    unum: ['male','female'],
    required: true
  },
  placeOfBirth: {
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
    enum: ['San Isidro Norte', 'Baybay Lopez'],
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
    default: '2417',
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
      'not eligigle',
      'eligible',
      'rejected',
      'approved',
      'updated'
    ]
  },
  createdBy: {
    type: String,
    ref: 'lgu accounts'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: '4ps accounts',
    unique: true
  },
  userId: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }  
});

const _4PsFormsModel = mongoose.model('4ps records', _4PsFormsModelSchema);

module.exports = _4PsFormsModel;
