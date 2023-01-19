const { check } = require("express-validator"),
  { validatorError } = require("../../middlewares/validatorError");
const category = require("../../models/categoryModel");
const slugify = require("slugify");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id."),
  validatorError,
];
exports.createSubCategeoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Require SubCategory Name")
    .isLength({ min: 2 })
    .withMessage("Minimum: 2")
    .isLength({ max: 18 })
    .withMessage("Maximum: 18")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Parent Category Required")
    .isMongoId()
    .withMessage("Invalid Id For Category")
    .custom((categoryId) =>
      category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  validatorError,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id."),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id For Category")
    .custom((categoryId) =>
      category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorError,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id."),
  validatorError,
];
