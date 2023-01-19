const subCategoryModel = require("../models/subCategoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../models/handlerFactory");

// POST
/* @desc    Create SubCategory
 * @route   POST   /api/v1/subcategories
 * @access  Private
 * */
exports.createSubCategory = createOne(subCategoryModel);

// POST - GET
/* @desc    Create and Get SubCategory by categoryId
 * @route   POST - GET   /api/v1/categories/:id/subcategories
 * @access  Private
 * */
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

// GET
/* @desc   Get List of SubCategories
 * @route  GET /api/v1/subcategories
 * @access Public
 * */
exports.getSubcategories = getAll(subCategoryModel);

/*  @desc    Get Specific SubCategory By Id
 *  @route   GET /api/v1/subcategories/:id
 *  @access  Public
 * */
exports.getSubCategory = getOne(
  subCategoryModel,
  `No Subcategory for this id: `
);

// UPDATE
/*
 *  @desc   Update Specific SubCategory
 *  @route  PUT /api/v1/subcategories/:id
 *  @access Private
 * */
exports.updateSubCategory = updateOne(
  subCategoryModel,
  `No Subcategory for this id: `
);

// DELETE
/*
 *  @desc   Delete Specific SubCategory
 *  @route  DELETE /api/v1/subcategories/:id
 *  @access Private
 * */
exports.deleteSubCategory = deleteOne(
  subCategoryModel,
  `No Subcategory for this id: `,
  `Delete done!`
);
