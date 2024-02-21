const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitForm, getAllEntries, getEntryById, updateEntry, deleteEntry } = require('../controllers/SeniorFormsControllers');
const { configureMulter } = require('../utils/multerHelpers');
const authenticateUser = require('../middleware/authMiddleware');

// Multer configuration
const upload = configureMulter();

// Routes
router.post('/submit', authenticateUser, upload.single('picture'), submitForm);
router.get('/entries', authenticateUser, getAllEntries);
router.get('/entries/:id', authenticateUser, getEntryById);
router.put('/entries/:id', authenticateUser, updateEntry);
router.delete('/entries/:id', authenticateUser, deleteEntry);

module.exports = router;
