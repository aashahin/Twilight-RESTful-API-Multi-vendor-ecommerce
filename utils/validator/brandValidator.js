const { check } = require("express-validator"),
  { validatorError } = require("../../middlewares/validatorError");
const slugify = require("slugify");
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id."),
  validatorError,
];
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Require Brand Name")
    .isLength({ min: 2 })
    .withMessage("Minimum: 2")
    .isLength({ max: 18 })
    .withMessage("Maximum: 18")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorError,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id."),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorError,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id."),
  validatorError,
];
