const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      minLength: [3, "Minimum is 3 words"],
      maxLength: [50, "Maximum is 50 words"],
      required: [true, "The name is required"],
    },
    discount: {
      type: Number,
      required: [true, "The Discount is required"],
    },
    expire: {
      type: Date,
      required: [true, "The Date Expire is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: [true],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
