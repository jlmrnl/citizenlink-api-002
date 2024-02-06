const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitForm, getAllEntries, getEntryById, updateEntry, deleteEntry } = require('../controllers/SeniorFormsControllers');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/'; // Specify the directory to store the files
    fs.mkdir(uploadPath, { recursive: true }).then(() => {
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/submit', upload.single('picture'), submitForm);
router.get('/entries', getAllEntries);
router.get('/entries/:id', getEntryById);
router.put('/entries/:id', updateEntry);
router.delete('/entries/:id', deleteEntry);

module.exports = router;
