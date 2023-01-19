const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Products",
        },
        quantity: Number,
        additions: String,
        price: Number,
        vendor: String,
        address: Object,
        isPaid: {
          type: Boolean,
          default: false,
        },
        paidAt: Date,
        isDelivered: {
          type: Boolean,
          default: false,
        },
        deliveredAt: Date,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title -category",
  })
  next();
});
module.exports = mongoose.model("Order", orderSchema);
