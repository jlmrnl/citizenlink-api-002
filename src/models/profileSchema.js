const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false
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
    }
  });
  
  const Profile = mongoose.model('Profile', profileSchema);

  module.exports = Profile;