const express = require("express");
const upload = require('../middleware/multerMiddleware');
const authenticateUser = require("../middleware/authMiddleware");
const extractUserIdFromToken = require("../middleware/jwtMiddleware");
const router = express.Router();
const {
  submitForm,
  getAllForms,
  getFormById,
  updateFormById,
  deleteFormById,
} = require("../controllers/_4PsFormsControllers");
const { login, getAllUsers } = require("../controllers/_4PsAuthControllers");
const { changePassword } =  require('../controllers/citizenAuth');

router.post(
  "/submit",
  extractUserIdFromToken,
  upload.fields([
    { name: '_1x1Picture', maxCount: 1 },
    { name: 'validDocs', maxCount: 1 }
  ]),
  (req, res) => submitForm(req, res, upload)
);
router.get("/forms", getAllForms);
router.get("/forms/:id", getFormById);
router.put("/forms/:id", authenticateUser, extractUserIdFromToken, updateFormById,
  upload.fields([
  { name: '_1x1Picture', maxCount: 1 },
  { name: 'validDocs', maxCount: 1 }
]),
(req, res) => submitForm(req, res, upload));
router.delete("/forms/:id", deleteFormById);

router.post("/login", login);
router.put('/change-password', authenticateUser, changePassword);
router.get("/users", getAllUsers);

module.exports = router;
