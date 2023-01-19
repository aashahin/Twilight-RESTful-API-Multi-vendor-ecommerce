const express = require("express"),
  router = express.Router(),
  {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
  } = require("../services/couponServices");
const { auth, permissions } = require("../services/auth/authService");
router
  .route("/")
  .get(auth, permissions("admin", "vendor"), getCoupons)
  .post(auth, permissions("admin", "vendor"), createCoupon);
// Coupon
router
  .route("/:id")
  .get(auth, permissions("admin", "vendor"), getCoupon)
  .put(auth, permissions("admin", "vendor"), updateCoupon)
  .delete(auth, permissions("admin", "vendor"), deleteCoupon);
module.exports = router;
