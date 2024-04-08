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
const upload = require("../middleware/multerMiddleware");
const authenticateUser = require("../middleware/authMiddleware");
const extractUserIdFromToken = require("../middleware/jwtMiddleware");

router.post(
  "/submit",
  extractUserIdFromToken,
  upload.fields([
    { name: '_1x1Picture', maxCount: 1 },
    { name: 'validDocs', maxCount: 1 }
  ]),
  (req, res) => submitForm(req, res, upload)
);

router.get("/entries", getAllEntries);
router.get("/entries/:id", getEntryById);

router.put(
  "/entries/:id",
  authenticateUser,
  extractUserIdFromToken,
  updateEntry,
  upload.fields([
    { name: '_1x1Picture', maxCount: 1 },
    { name: 'validDocs', maxCount: 1 }
  ]),
  (req, res) => updateEntry(req, res, upload)
);

router.delete("/entries/:id", deleteEntry);

router.post("/login", login);
router.put('/change-password', authenticateUser, changePassword);

module.exports = router;
