const express = require("express");
const router = express.Router();
const { login } = require("../controllers/SeniorAuthControllers");
const { changePassword } = require('../controllers/citizenAuth');
const {
  submitForm,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../controllers/SeniorFormsControllers");
const { configureMulter } = require("../middleware/multerMiddleware");
const authenticateUser = require("../middleware/authMiddleware");
const extractUserIdFromToken = require("../middleware/jwtMiddleware");

const upload = configureMulter();

router.post(
  "/submit",
  authenticateUser,
  extractUserIdFromToken,
  upload.fields([
    { name: '1x1Picture', maxCount: 1 },
    { name: 'validDocs', maxCount: 1 }
  ]),
  (req, res) => submitForm(req, res, upload)
);

router.get("/entries", getAllEntries);

router.get("/entries/:id", getEntryById);

router.put(
  "/entries/:id",
  authenticateUser,
  updateEntry,
  upload.fields([
    { name: '1x1Picture', maxCount: 1 },
    { name: 'validDocs', maxCount: 1 }
  ]),
  (req, res) => updateEntry(req, res, upload)
);

router.delete("/entries/:id", deleteEntry);

router.post(
  "/register-online",
  submitForm,
  upload.fields([
    { name: '1x1Picture', maxCount: 1 },
    { name: 'validDocs', maxCount: 1 }
  ]),
  (req, res) => submitForm(req, res, upload)
);

router.post("/login", login);

router.put('/change-password', authenticateUser, changePassword);

module.exports = router;
