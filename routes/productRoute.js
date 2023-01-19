const express = require("express"),
  router = express.Router(),
  {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    processImages,
    uploadImages,
    getVendorProducts,
  } = require("../services/productServices"),
  {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
  } = require("../utils/validator/productValidator"),
  reviewRoute = require("./reviewRoute");
const { auth, permissions } = require("../services/auth/authService");

// Vendor
router.route("/vendor").get(auth, permissions("vendor"), getVendorProducts);
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    auth,
    permissions("admin", "vendor"),
    uploadImages,
    processImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    auth,
    permissions("admin", "vendor"),
    uploadImages,
    processImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    auth,
    permissions("admin", "vendor"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
