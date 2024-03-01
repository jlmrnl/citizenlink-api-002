const express = require('express');
const router = express.Router();
const { submitForm, getAllForms, getFormById, updateFormById, deleteFormById } = require('../controllers/_4PsFormsControllers');
const authenticateUser = require('../middleware/authMiddleware');
const extractUserIdFromToken = require('../middleware/jwtMiddleware');

router.post('/submit', authenticateUser, extractUserIdFromToken, submitForm);
router.get('/forms', authenticateUser, getAllForms);
router.get('/forms/:id', authenticateUser, getFormById);
router.put('/forms/:id', authenticateUser, updateFormById);
router.delete('/forms/:id', authenticateUser, deleteFormById);

module.exports = router;
