const multer = require('multer');
const fs = require('fs').promises;

function configureMulter() {
  const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const uploadPath = 'uploads/';
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    }
  });

  return multer({ storage: storage });
}

module.exports = { configureMulter };
