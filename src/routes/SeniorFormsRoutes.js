const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitForm, getAllEntries, getEntryById, updateEntry, deleteEntry } = require('../controllers/SeniorFormsControllers');
const { configureMulter } = require('../utils/multerHelpers');

// Multer configuration
const upload = configureMulter();

// Routes
router.post('/submit', upload.single('picture'), submitForm);
router.get('/entries', getAllEntries);
router.get('/entries/:id', getEntryById);
router.put('/entries/:id', updateEntry);
router.delete('/entries/:id', deleteEntry);

module.exports = router;
