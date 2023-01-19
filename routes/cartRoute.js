const express = require("express"),
  router = express.Router(),
  {
    addToCart,
    getCart,
    deleteOneCart,
    clearCart,
    updateCart,
    applyCoupon,
  } = require("../services/cartServices");
const { auth, permissions } = require("../services/auth/authService");
router.use(auth, permissions("user"));
router
  .route("/")
  .post(addToCart)
  .get(getCart)
  .put(applyCoupon)
  .delete(clearCart);
router.route("/:id").put(updateCart).delete(deleteOneCart);
module.exports = router;
