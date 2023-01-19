const { check } = require("express-validator"),
  { validatorError } = require("../../middlewares/validatorError");
const Review = require("../../models/reviewModel");
exports.getViewValidator = [
  check("id").isMongoId().withMessage("Invalid View Id."),
  validatorError,
];
exports.createViewValidator = [
  check("content")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Minimum: 5")
    .isLength({ max: 100 })
    .withMessage("Maximum: 100"),
  check("ratings")
    .notEmpty()
    .withMessage("Rating is Required")
    .isFloat({ min: 1, max: 5 }),
  check("product")
    .isMongoId()
    .withMessage("Invalid View product.")
    .custom(async (val, { req }) => {
      return await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("You already created a review before")
          );
        }
      });
    }),
  validatorError,
];
exports.updateViewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid View Id.")
      .custom(async(val,{req})=>{
        return await Review.findById(val).then((succ)=>{
          if(!succ){
            return Promise.reject(new Error(`There is no review with id ${val}`))
          }
          if(succ.user._id.toString() !== req.user._id.toString()){
            return Promise.reject(new Error("Access Denied!"))
          }
        })
      })
  ,
  check("content")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Minimum: 5")
    .isLength({ max: 100 })
    .withMessage("Maximum: 100"),
  check("ratings")
    .notEmpty()
    .withMessage("Rating is Required")
    .isFloat({ min: 1, max: 5 }),
  validatorError,
];
exports.deleteViewValidator = [
  check("id")
      .isMongoId()
      .withMessage("Invalid View Id.")
      .custom(async(val,{req})=>{
        return await Review.findById(val).then((succ)=>{
          if(!succ){
            return Promise.reject(new Error(`There is no review with id ${val}`))
          }
          if(req.user.role === "user"){
            if(succ.user._id.toString() !== req.user._id.toString()){
              return Promise.reject(new Error("Access Denied!"))
            }
          }
        })
      }),
  validatorError,
];
