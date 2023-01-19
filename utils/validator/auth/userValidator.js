const { check, body } = require("express-validator");
const { UserModel } = require("../../../models/auth/userModel");
const { validatorError } = require("../../../middlewares/validatorError");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id."),
  validatorError,
];
exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Require User Name")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is a required")
    .isLength({ min: 8 })
    .withMessage("Minimum: 8")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .isEmail()
    .withMessage("Enter an Email is valid")
    .custom((email, { req }) =>
      UserModel.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This Email already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is a required")
    .isLength({ min: 8 })
    .withMessage("Minimum: 8")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .custom((pass, { req }) => {
      if (pass !== req.body.passConfirm) {
        throw new Error("Password Confirmation incorrect!");
      }
      return true;
    }),
  check("passConfirm")
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("Maximum: 50"),
  check("role").optional(),
  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone("any")
    .isLength({ min: 6 })
    .withMessage("Minimum: 6")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50"),
  validatorError,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id."),
  check("name")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .isEmail()
    .withMessage("Enter an Email is valid")
    .custom((email, { req }) =>
      UserModel.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This Email already exists"));
        }
      })
    ),
  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Minimum: 8")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .custom((pass, { req }) => {
      if (pass !== req.body.passConfirm) {
        throw new Error("Password Confirmation incorrect!");
      }
      return true;
    }),
  check("passConfirm")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Maximum: 50"),
  check("role").optional(),
  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Enter a Phone is valid")
    .isLength({ min: 6 })
    .withMessage("Minimum: 6")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50"),
  validatorError,
];
exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword").notEmpty().withMessage("Current password required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation required"),
  body("password")
    .notEmpty()
    .withMessage("Enter The New password")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("Invalid User Id.");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorError,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id."),
  validatorError,
];

// User
exports.changeUserPasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation required"),
  body("password")
    .notEmpty()
    .withMessage("Enter The New password")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        throw new Error("Invalid User Id.");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorError,
];
exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .isEmail()
    .withMessage("Enter an Email is valid")
    .custom((email, { req }) =>
      UserModel.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This Email already exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Minimum: 6")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50"),
  validatorError,
];
