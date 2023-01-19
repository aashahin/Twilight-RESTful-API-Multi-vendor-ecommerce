const { check, body } = require("express-validator");
const { UserModel } = require("../../../models/auth/userModel");
const { validatorError } = require("../../../middlewares/validatorError");
const slugify = require("slugify");

exports.signupValidator = [
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
    .custom((email) =>
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
  validatorError,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is a required")
    .isLength({ min: 8 })
    .withMessage("Minimum: 8")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50")
    .isEmail()
    .withMessage("Invalid Email"),
  check("password")
    .notEmpty()
    .withMessage("password is a required")
    .isLength({ min: 8 })
    .withMessage("Minimum: 8")
    .isLength({ max: 50 })
    .withMessage("Maximum: 50"),
  validatorError,
];
exports.resetPasswordValidator = [
  body("newPassword").isLength({ min: 8 }).withMessage("Minimum password: 8"),
  validatorError,
];
