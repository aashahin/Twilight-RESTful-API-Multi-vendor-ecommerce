const { check } = require("express-validator"),
  { validatorError } = require("../../middlewares/validatorError");
const slugify = require("slugify");
const category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id."),
  validatorError,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id."),
  check("price")
    .notEmpty()
    .isNumeric()
    .withMessage("The Price must be a number")
    .isLength({ max: 10 })
    .withMessage("Maximum Price is 1000000")
    .toFloat(),
  check("discount")
    .notEmpty()
    .isNumeric()
    .withMessage("The Discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("Discount must be lower than price");
      } else {
        return true;
      }
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id For Category")
    .custom((val) =>
      category.findById(val).then((result) => {
        if (!result) {
          return Promise.reject(new Error(`No category for this id: ${val}`));
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id For SubCategory")
    .custom((val) =>
      SubCategory.find({ _id: { $exists: true, $in: val } }).then((result) => {
        if (result.length < 1 || result.length !== val.length) {
          return Promise.reject(
            new Error(`No Subcategory for this id: ${val}`)
          );
        }
      })
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          let subCategories = [];
          subcategories.forEach((SubCategory) => {
            subCategories.push(SubCategory._id.toString());
          });
          const checker = val.every((value) => subCategories.includes(value));
          if (!checker) {
            return Promise.reject(
              new Error(`Subcategories not belong to category`)
            );
          }
        }
      )
    ),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorError,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id."),
  validatorError,
];
exports.createProductValidator = [
  check("title")
    .isLength({ min: 5 })
    .withMessage("Minimum for Description is 5")
    .isLength({ max: 60 })
    .withMessage("Maximum for Description is 60")
    .notEmpty()
    .withMessage("The Title is Required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("The Description is Required")
    .isLength({ max: 1000 })
    .withMessage("Maximum for Description is 1000"),
  check("quantity")
    .notEmpty()
    .withMessage("The Quantity is Required")
    .isNumeric()
    .withMessage("The Quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("The Quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("The Price is Required")
    .isNumeric()
    .withMessage("The Price must be a number")
    .isLength({ max: 10 })
    .withMessage("Maximum Price is 1000000"),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("The Discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Discount must be lower than price");
      } else {
        return true;
      }
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("The Colors Should be array of string"),
  check("imageCover").notEmpty().withMessage("The Cover is Required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("The Images Should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("The category is Required")
    .isMongoId()
    .withMessage("Invalid Id For Category")
    .custom((val) =>
      category.findById(val).then((result) => {
        if (!result) {
          return Promise.reject(new Error(`No category for this id: ${val}`));
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id For SubCategory")
    .custom((val) =>
      SubCategory.find({ _id: { $exists: true, $in: val } }).then((result) => {
        if (result.length < 1 || result.length !== val.length) {
          return Promise.reject(
            new Error(`No Sub Category for this id: ${val}`)
          );
        }
      })
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategories = [];
          subcategories.forEach((SubCategory) => {
            subCategories.push(SubCategory._id.toString());
          });
          const checker = val.every((value) => subCategories.includes(value));
          if (!checker) {
            return Promise.reject(
              new Error(`Sub Categories not belong to category`)
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid Id For Brand"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings Average must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating Must Be Above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating Must Be Below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings Quantity must be a number"),
  validatorError,
];
