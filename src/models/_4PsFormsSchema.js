const mongoose = require('mongoose');

const _4PsFormsModelSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
    maxlength: 50
  },
  firstname: {
    type: String,
    required: true,
    maxlength: 50
  },
  middlename: {
    type: String,
    maxlength: 50
  },
  suffix: {
    type: String,
    maxlength: 11
  },
  sex:{
    type: String,
    enum: ['male','female'],
    required: true
  },
  placeOfBirth: {
    type: String,
    maxlength: 50
  },
  houseNumber: {
    type: Number,
    required: true,
    maxlength: 5
  },
  street: {
    type: String,
    required: true,
    maxlength: 50
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
    required: true,
    maxlength: 4
  },
  dateOfBirth: {
    type: Date
  },
  contactNumber: {
    type: String,
    required: true,
    maxlength: 11
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
  numberOfChild: {
    type: Number,
    maxlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  }  
});

const _4PsFormsModel = mongoose.model('4ps records', _4PsFormsModelSchema);

module.exports = _4PsFormsModel;
