const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  checkAdminRole,
  getAllUsers,
  changePassword
} = require("../controllers/adminAuthControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put('/change-password', authenticateUser, changePassword);


router.get("/userCount", checkAdminRole);
router.get("/users", getAllUsers);

module.exports = router;
