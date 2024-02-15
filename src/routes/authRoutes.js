const express = require('express');
const router = express.Router();
const { registerUser, loginUser, checkAdminRole } = require('../controllers/authControllers');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/userCount', checkAdminRole);

module.exports = router;