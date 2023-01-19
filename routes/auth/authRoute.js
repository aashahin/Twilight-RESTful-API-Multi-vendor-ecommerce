const express = require("express"),
  router = express.Router();
const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../../utils/validator/auth/authValidator");
const {
  signup,
  login,
  forgetPassword,
  resetCode,
  resetPassword,
} = require("../../services/auth/authService");

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgetPassword);
router.post("/verify-reset-code", resetCode);
router.put("/reset-password", resetPasswordValidator, resetPassword);
module.exports = router;
