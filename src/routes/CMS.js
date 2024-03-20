const express = require('express');
const router = express.Router();
const authenticateUser  = require('../middleware/authMiddleware');
const { createLink, getLinks, getLinkById, updateLink, deleteLink } = require('../controllers/CMS');

// Routes
router.post('/add', authenticateUser, createLink);
router.get('/', getLinks);
router.get('/:id', authenticateUser, getLinkById);
router.put('/edit/:id', authenticateUser, updateLink);
router.delete('/:id', authenticateUser, deleteLink);

module.exports = router;
