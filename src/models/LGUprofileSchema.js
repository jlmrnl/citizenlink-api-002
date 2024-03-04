const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
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
    createdAt: {
      type: Date,
      default: Date.now
    }  
  });
  
  const Profile = mongoose.model('lgu profiles', profileSchema);

  module.exports = Profile;