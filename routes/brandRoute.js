const express = require("express"),
  router = express.Router(),
  {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
  } = require("../utils/validator/brandValidator"),
  {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    uploadImages,
    processImage,
  } = require("../services/brandServices");
const { auth, permissions } = require("../services/auth/authService");
router
  .route("/")
  .get(getBrands)
  .post(
    auth,
    permissions("admin", "vendor"),
    uploadImages,
    processImage,
    createBrandValidator,
    createBrand
  );
// Brand
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    auth,
    permissions("admin", "vendor"),
    uploadImages,
    processImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    auth,
    permissions("admin", "vendor"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
