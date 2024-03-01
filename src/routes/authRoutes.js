const express = require('express');
const router = express.Router();
const { registerUser, loginUser, checkAdminRole, getAllUsers } = require('../controllers/authControllers');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/userCount', checkAdminRole);
router.get('/users', getAllUsers);

module.exports = router;