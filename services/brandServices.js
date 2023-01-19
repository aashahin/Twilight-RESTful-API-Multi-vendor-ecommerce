const brandModel = require("../models/brandModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../models/handlerFactory");
const { uploadSingleImage } = require("../middlewares/images/upImages");
const expressAsyncHandler = require("express-async-handler");
const sharp = require("sharp");

exports.uploadImages = uploadSingleImage("image");
exports.processImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});
// POST
/*
 * @desc    Create Brand
 * @route   POST   /api/v1/brands
 * @access  Private
 * */
exports.createBrand = createOne(brandModel);
// GET
/*
 * @desc   List of Brands
 * @route  GET /api/v1/brands
 * @access Public
 * */
exports.getBrands = getAll(brandModel);

/*
 *  @desc    Get Specific Brand By Id
 *  @route   GET /api/v1/brands/:id
 *  @access  Public
 * */
exports.getBrand = getOne(brandModel, `No Brand for this id: `);

// UPDATE
/*
 *  @desc   Update Specific brand
 *  @route  PUT /api/v1/brands/:id
 *  @access Private
 * */
exports.updateBrand = updateOne(brandModel, `No Brand for this id: `);

// DELETE
/*
 *  @desc   Delete Specific Brand
 *  @route  DELETE /api/v1/brands/:id
 *  @access Private
 * */
exports.deleteBrand = deleteOne(
  brandModel,
  `No Brand for this id: `,
  `Delete done!`
);
