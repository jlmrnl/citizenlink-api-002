const multer = require('multer');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadFolder = 'uploads/';
    // Create the uploads folder if it doesn't exist
    fs.mkdir(uploadFolder, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating uploads directory:', err);
      }
      cb(null, uploadFolder); // Set destination to uploads folder
    });
  },
  filename: function (req, file, cb) {
    // Use current timestamp as filename to ensure uniqueness
    cb(null, Date.now() + '_' + file.originalname);
  }
});

// Define file filter to accept only certain file types
const fileFilter = function (req, file, cb) {
  // Accept only JPEG and PNG files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.')); // Reject file
  }
};

// Initialize Multer with configuration
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
