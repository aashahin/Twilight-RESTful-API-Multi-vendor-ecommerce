const mongoose = require("mongoose");
const Products = require("./productModel");
const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      max: [100, "Maximum for review is 100 word"],
    },
    ratings: {
      type: Number,
      min: [1, "Min rating value 1.0"],
      max: [5, "Min rating value 1.0"],
      required: [true, "Rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: [true, "Must belong to user"],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const calc = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        ratingsAverage: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (calc.length > 0) {
    await Products.findByIdAndUpdate(productId, {
      ratingsAverage: calc[0].ratingsAverage,
      ratingsQuantity: calc[0].ratingsQuantity,
    });
  } else {
    await Products.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
