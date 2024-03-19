const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { login, changePassword } = require("../controllers/SeniorAuthControllers");
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

const upload = configureMulter();

router.post(
  "/submit",
  authenticateUser,
  extractUserIdFromToken,
  upload.single("picture"),
  (req, res) => submitForm(req, res, upload)
);
router.get("/entries", getAllEntries);
router.get("/entries/:id", getEntryById);
router.put(
  "/entries/:id",  
  updateEntry, 
  upload.single("picture"),
(req, res) => updateEntry(req, res, upload));
router.delete("/entries/:id",  deleteEntry);

router.post("/login", login);
router.put('/change-password', authenticateUser, changePassword);

module.exports = router;
