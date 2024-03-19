const multer = require('multer');
const fs = require('fs').promises;

const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const uploadPath = 'uploads/';
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        // If directory creation is successful, call the callback function with null error
        cb(null, uploadPath);
      } catch (error) {
        // If an error occurs during directory creation, pass the error to the callback function
        cb(error);
      }
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    }
  });

  return multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      // Ensure only certain file types are allowed, adjust this as needed
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
      }
    }
  });
};

module.exports = { configureMulter };
