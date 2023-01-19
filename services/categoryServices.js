const CategoryModel = require("../models/categoryModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../models/handlerFactory");
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/images/upImages");

exports.uploadImages = uploadSingleImage("image");
exports.processImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/categories/${filename}`);
    req.body.image = filename;
  }
  next();
});
// POST
/*
 * @desc    Create Category
 * @route   POST   /api/v1/category
 * @access  Private
 * */
exports.createCategory = createOne(CategoryModel);

// GET
/*
 * @desc   GET List of Categories
 * @route  GET /api/v1/categories
 * @access Public
 * */
exports.getCategories = getAll(CategoryModel);

/*
 *  @desc    Get Specific Category By Id
 *  @route   GET /api/v1/categories/:id
 *  @access  Public
 * */
exports.getCategory = getOne(CategoryModel, "No Category for this id: ");

// UPDATE
/*
 *  @desc   Update Specific Category
 *  @route  PUT /api/v1/categories/:id
 *  @access Private
 * */
exports.updateCategory = updateOne(CategoryModel, `No Category for this id: `);

// DELETE
/*
 *  @desc   Delete Specific Category
 *  @route  DELETE /api/v1/categories/:id
 *  @access Private
 * */
exports.deleteCategory = deleteOne(
  CategoryModel,
  `No Category for this id: `,
  `Delete done!`
);
