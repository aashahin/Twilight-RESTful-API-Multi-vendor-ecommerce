const Review = require("../models/reviewModel"),
  {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
  } = require("../models/handlerFactory");

// Nested Route
/*
 * GET / api/v1/products/productId/reviews
 * */
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};
/*
 * POST /api/v1/products/productId/reviews
 *  */
exports.setProductToId = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  next();
};
// POST
/*
 * @desc    Create Review
 * @route   POST   /api/v1/reviews
 * @access  Private/Auth(User)
 * */
exports.createReview = createOne(Review, true);
// GET
/*
 * @desc   List of Review
 * @route  GET /api/v1/reviews
 * @access Public
 * */
exports.getReviews = getAll(Review);

/*
 *  @desc    Get Specific Review By Id
 *  @route   GET /api/v1/reviews/:id
 *  @access  Public
 * */
exports.getReview = getOne(Review, `No Review for this id: `);

// UPDATE
/*
 *  @desc   Update Specific brand
 *  @route  PUT /api/v1/reviews/:id
 *  @access Private/Auth(User)
 * */
exports.updateReview = updateOne(Review, `No Review for this id: `, true);

// DELETE
/*
 *  @desc   Delete Specific Review
 *  @route  DELETE /api/v1/reviews/:id
 *  @access Private/Auth(Admin-User)
 * */
exports.deleteReview = deleteOne(
  Review,
  `No Review for this id: `,
  `Delete done!`
);
