const express = require("express"),
  router = express.Router({ mergeParams: true }),
  {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview,
    createFilterObject,
    setProductToId,
  } = require("../services/reviewServices");
const { auth, permissions } = require("../services/auth/authService");
const {
  createViewValidator,
  getViewValidator,
  updateViewValidator,
  deleteViewValidator,
} = require("../utils/validator/viewValidator");

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    auth,
    permissions("user"),
    setProductToId,
    createViewValidator,
    createReview
  );
// Review
router
  .route("/:id")
  .get(setProductToId,getViewValidator, getReview)
  .put(
    auth,
    permissions("user"),
    setProductToId,
    updateViewValidator,
    updateReview
  )
  .delete(
    auth,
    permissions("admin", "user"),
    setProductToId,
    deleteViewValidator,
    deleteReview
  );
module.exports = router;
