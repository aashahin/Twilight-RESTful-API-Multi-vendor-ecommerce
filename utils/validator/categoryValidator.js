const { check } = require("express-validator"),
  { validatorError } = require("../../middlewares/validatorError");
const slugify = require("slugify");
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id."),
  validatorError,
];
exports.createCategeoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Require Category Name")
    .isLength({ min: 2 })
    .withMessage("Minimum: 2")
    .isLength({ max: 18 })
    .withMessage("Maximum: 18")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .trim(),
  validatorError,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id."),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorError,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id."),
  validatorError,
];
