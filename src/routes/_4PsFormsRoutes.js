const express = require("express");
const router = express.Router();
const {
  submitForm,
  getAllForms,
  getFormById,
  updateFormById,
  deleteFormById,
} = require("../controllers/_4PsFormsControllers");
const { login, getAllUsers } = require("../controllers/_4PsAuthControllers");
const authenticateUser = require("../middleware/authMiddleware");
const extractUserIdFromToken = require("../middleware/jwtMiddleware");

router.post("/submit", authenticateUser, extractUserIdFromToken, submitForm);
router.get("/forms", getAllForms);
router.get("/forms/:id", getFormById);
router.put("/forms/:id", updateFormById);
router.delete("/forms/:id", deleteFormById);

router.post("/login", login);
router.get("/users", getAllUsers);

module.exports = router;
