const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { login } = require("../controllers/SeniorAuthControllers");
const {
  submitForm,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../controllers/SeniorFormsControllers");
const { configureMulter } = require("../utils/multerHelpers");
const authenticateUser = require("../middleware/authMiddleware");
const extractUserIdFromToken = require("../middleware/jwtMiddleware");

// Multer configuration
const upload = configureMulter();

// Routes
router.post(
  "/submit",
  authenticateUser,
  extractUserIdFromToken,
  upload.single("picture"),
  submitForm
);
router.get("/entries", getAllEntries);
router.get("/entries/:id", getEntryById);
router.put("/entries/:id", updateEntry);
router.delete("/entries/:id", deleteEntry);

router.post("/login", login);

module.exports = router;
