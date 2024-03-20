const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50
    },
    middleName: {
      type: String,
      maxlength: 50
    },
    suffix:{
      type: String,
      maxlength: 11
    },
    position: {
      type: String,
      default: 'NA',
      maxlength: 16
    },
    dateOfBirth: {
      type: String
    },
    accessLevel: {
    type: String,
    required: true,
    enum: [
      'regional', 
      'municipal', 
      'barangay', 
      'citizen',
    ],
    default: 'citizen' // Default access level is 'citizen'
    },
    accountStatus: { // This is for account activation
    type: String,
    required: false,
    enum: [
      'active',
      'deactivated',
      'archived'
    ],
    default: 'active' // Default status is 'active'
    },
    barangay: {
      type: String,
      enum: ['San Isidro Norte', 'Baybay Lopez']
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
  
  const Profile = mongoose.model('lgu profiles', profileSchema);

  module.exports = Profile;