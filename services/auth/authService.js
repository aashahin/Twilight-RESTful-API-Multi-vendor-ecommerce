const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { UserModel } = require("../../models/auth/userModel");
const ApiErrors = require("../../utils/apiErrors");
const { sendEmail, templateMail } = require("../../utils/email");
const { createToken } = require("../../utils/auth/token");
const {sanitizeUser} = require("../../utils/sanitize");

// POST
/*
 * @desc    Signup
 * @route   POST   /api/v1/auth/signup
 * @access  Public
 * */
exports.signup = expressAsyncHandler(async (req, res) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = createToken(user._id);
  res.status(201).json({ data: sanitizeUser(user), token });
});

/*
 * @desc    Login
 * @route   POST   /api/v1/auth/login
 * @access  Public
 * */
exports.login = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiErrors("Incorrect email or password", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: sanitizeUser(user), token });
});

// Auth
exports.auth = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiErrors("Access Denied!", 401));
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const currUser = await UserModel.findById(decoded.id);
  if (!currUser) {
    return next(new ApiErrors("This The user does no longer exist"));
  }
  if (currUser.passwordChangedAt) {
    const passChangTimestamp = parseInt(
      currUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangTimestamp > decoded.iat) {
      // console.log(passChangTimestamp,decoded.iat)
      return next(new ApiErrors("An error occurred, Please Re-login.", 401));
    }
  }
  req.user = currUser;
  next();
});

// Permissions
exports.permissions = (...roles) => {
  return expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiErrors("Access Denied!", 403));
    }
    next();
  });
};

// Forgot Password
/*
 * @desc    Forgot Password
 * @route   POST   /api/v1/auth/forgot-password
 * @access  Public
 * */
exports.forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiErrors("Error in email, Please recheck your email", 404)
    );
  }

  // Generate verify code and save in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Encrypt Digits
  user.passwordResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Expiration for Digits
  user.passwordResetExp = Date.now() + 15 * 60 * 1000;
  // Verify
  user.passwordResetVerified = false;
  // Save digits in database
  await user.save();

  // Send email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code",
      message: templateMail(user.name, resetCode),
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExp = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(
      new ApiErrors("Failed in send, please retry in later time.", 500)
    );
  }
  res.status(200).json({
    status: "Success",
    message:
      "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.",
  });
});

// Verify Code
/*
 * @desc    Verify Code
 * @route   POST   /api/v1/auth/verify-reset-code
 * @access  Public
 * */
exports.resetCode = expressAsyncHandler(async (req, res, next) => {
  const resetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: resetCode,
    passwordResetExp: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiErrors("Invalid reset code or expired", 401));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "Successful" });
});

// Reset Password
/*
 * @desc    Reset Password
 * @route   POST   /api/v1/auth/reset-password
 * @access  Public
 * */
exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiErrors("Invalid email", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiErrors("Please confirm the verification code", 400));
  }
  if (await bcrypt.compare(req.body.newPassword, user.password)) {
    return next(new ApiErrors("This password has already been used", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExp = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  res.status(200).json({ status: "Successful" });
});
