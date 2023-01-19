const express = require("express"),
  router = express.Router(),
  {
    getCategoryValidator,
    createCategeoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
  } = require("../utils/validator/categoryValidator"),
  {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadImages,
    processImage,
  } = require("../services/categoryServices"),
  subCategoriesRoute = require("./subCategoryRoute");
const { auth, permissions } = require("../services/auth/authService");

router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    auth,
    permissions("admin"),
    uploadImages,
    processImage,
    createCategeoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    auth,
    permissions("admin"),
    uploadImages,
    processImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(auth, permissions("admin"), deleteCategoryValidator, deleteCategory);
module.exports = router;
