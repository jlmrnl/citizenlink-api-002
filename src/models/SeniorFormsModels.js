const mongoose = require('mongoose');

const SeniorFormsModelSchema = new mongoose.Schema({
  typeOfApplication: {
    type: String,
    required: true,
    enum: ['New', 'Replacement']
  },
  idNumber: {
    required: 'false',
    type: Number
  },
  medicineBookletNumber: {
    required: 'false',
    type: Number
  },
  purchaseDTIbooklet: {
    required: 'false',
    type: Number
  },
  dateOfApplication: {
    type: Date,
    required: true
  },
  barangay: {
    type: String,
    enum: ['San Isidro Norte', 'San Isidro Sur'],
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
    type: String,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return /^(\d{11})$/.test(v); // Validate if the number is exactly 10 digits long
      },
      message: props => `${props.value} is not a valid phone number!`
    }
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
  }
});

const SeniorFormsModels = mongoose.model('SeniorFormsModels', SeniorFormsModelSchema);

module.exports = SeniorFormsModels;
