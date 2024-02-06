const express = require('express');
const router = express.Router();
const { submitForm, getAllForms, getFormById, updateFormById, deleteFormById } = require('../controllers/_4PsFormsControllers');

router.post('/submit', submitForm);
router.get('/forms', getAllForms);
router.get('/forms/:id', getFormById);
router.put('/forms/:id', updateFormById);
router.delete('/forms/:id', deleteFormById);

module.exports = router;
