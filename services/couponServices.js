const couponModel = require("../models/couponModel");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("../models/handlerFactory");

// POST
/*
 * @desc    Create Coupon
 * @route   POST   /api/v1/coupons
 * @access  Auth(Admin-Vendor)
 * */
exports.createCoupon = createOne(couponModel, false, false, true);
// GET
/*
 * @desc   List of Coupons
 * @route  GET /api/v1/coupons
 * @access Auth(Admin-Vendor)
 * */
exports.getCoupons = getAll(couponModel);

/*
 *  @desc    Get Specific Coupon By Id
 *  @route   GET /api/v1/coupons/:id
 *  @access  Auth(Admin-Vendor)
 * */
exports.getCoupon = getOne(couponModel, `No Coupon for this id: `);

// UPDATE
/*
 *  @desc   Update Specific coupon
 *  @route  PUT /api/v1/coupons/:id
 *  @access Auth(Admin-Vendor)
 * */
exports.updateCoupon = updateOne(couponModel, `No Coupon for this id: `);

// DELETE
/*
 *  @desc   Delete Specific Coupon
 *  @route  DELETE /api/v1/coupons/:id
 *  @access Auth(Admin-Vendor)
 * */
exports.deleteCoupon = deleteOne(
  couponModel,
  `No Coupon for this id: `,
  `Delete done!`
);
