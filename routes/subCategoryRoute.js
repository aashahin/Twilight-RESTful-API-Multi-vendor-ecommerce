const express = require("express"),
  router = express.Router({ mergeParams: true }),
  {
    getSubCategoryValidator,
    createSubCategeoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
  } = require("../utils/validator/subCategoryValidator"),
  {
    createSubCategory,
    getSubcategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
  } = require("../services/subCategoryServices");
const { auth, permissions } = require("../services/auth/authService");

router
  .route("/")
  .post(
    auth,
    permissions("admin"),
    setCategoryIdToBody,
    createSubCategeoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubcategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    auth,
    permissions("admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    auth,
    permissions("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
