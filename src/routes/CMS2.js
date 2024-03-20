const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");
const {
  createLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
} = require("../controllers/CMS2");

// Routes
router.post("/add", createLink);
router.get("/", getLinks);
router.get("/:id", getLinkById);
router.put("/edit/:id", updateLink);
router.delete("/:id", deleteLink);

module.exports = router;
