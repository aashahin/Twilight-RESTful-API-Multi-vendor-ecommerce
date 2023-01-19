const productModel = require("../models/productModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
} = require("../models/handlerFactory");
const expressAsyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadMultiImages } = require("../middlewares/images/upImages");

// Images Storage and Processing
exports.uploadImages = uploadMultiImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);
exports.processImages = expressAsyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1300)
      .toFormat("jpeg")
      .toFile(`uploads/products/${imageName}`);
    req.body.imageCover = imageName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
        const imageName = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1300)
          .toFormat("jpeg")
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
    next();
  }
});

// POST
/* @desc    Create Product
 * @route   POST   /api/v1/products
 * @access  Private
 * */
exports.createProduct = createOne(productModel, false, true);

// GET
/*
 * @desc   GET List of Products
 * @route  GET /api/v1/products
 * @access Public
 * */
exports.getProducts = getAll(productModel, true);
/*
 * @desc   GET List of Products
 * @route  GET /api/v1/products/vendor
 * @access Auth/Vendor
 * */
exports.getVendorProducts = getAll(productModel, false,true)

/*
 *  @desc    Get Specific Product By id
 *  @route   GET /api/v1/products/:id
 *  @access  Public
 * */
exports.getProduct = getOne(
  productModel,
  `No Product for this id: `,
  "reviews"
);

// UPDATE
/*
 *  @desc   Update Specific Product
 *  @route  PUT /api/v1/products/:id
 *  @access Private
 * */
exports.updateProduct = updateOne(productModel, `No Product for this id: `);

// DELETE
/*
 *  @desc   Delete Specific Product
 *  @route  DELETE /api/v1/products/:id
 *  @access Private
 * */
exports.deleteProduct = deleteOne(
  productModel,
  `No Product for this id: `,
  `Delete done!`
);
