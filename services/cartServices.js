const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Products = require("../models/productModel");
const ApiErrors = require("../utils/apiErrors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
function calc(cart) {
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  cart.totalPrice = total;
  cart.totalAfterDiscount = undefined;
  return total;
}

// POST
/*
 * @desc    Add to cart
 * @route   POST   /api/v1/cart
 * @access  Auth(User)
 * */
exports.addToCart = expressAsyncHandler(async (req, res, next) => {
  const { productId, additions } = req.body;
  const product = await Products.findById(productId);

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (product.quantity < 1) {
    return next(new ApiErrors("This product is unavailable", 404));
  }
  if (!cart) {
    // create cart fot logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          additions,
          price: product.price,
          vendor: String(product.user),
          address: { ...req.user.addresses },
          orderId: mongoose.Schema.Types.ObjectId,
        },
      ],
    });
  } else {
    // product exist in cart, update product quantity
    const itemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId && item.additions === additions
    );
    if (itemIndex > -1) {
      // check from cart quantity if greater than product quantity
      const check = cart.cartItems[0].quantity + 1 > product.quantity;
      if (check) {
        return next(new ApiErrors("This product is unavailable", 404));
      }
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity++;
      cart.cartItems[itemIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        additions,
        price: product.price,
        vendor: String(product.user),
        address: { ...req.user.addresses },
        orderId: mongoose.Schema.Types.ObjectId,
      });
    }
  }
  calc(cart);
  await cart.save();
  res
    .status(200)
    .json({ status: "success", msg: "Added to cart!", data: cart });
});
// GET
/*
 * @desc    Get cart
 * @route   GET   /api/v1/cart
 * @access  Auth(User)
 * */
exports.getCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiErrors("Cart is empty", 404));
  }
  res.status(200).json({ result: cart.cartItems.length, data: cart });
});
//Put
/*
 * @desc    Update cart
 * @route   PUT   /api/v1/cart/:id
 * @access  Auth(User)
 * */
exports.updateCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const { quantity } = req.body;
  if (!cart) {
    return next(new ApiErrors("Cart is empty", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
    console.log(cartItem);
  } else {
    return next(new ApiErrors("This id is incorrect", 404));
  }
  calc(cart);
  await cart.save();
  res.status(200).json({ result: cart.cartItems.length, data: cart });
});
/*
 * @desc    Apply Coupon on cart
 * @route   PUT   /api/v1/cart
 * @access  Auth(User)
 * */
exports.applyCoupon = expressAsyncHandler(async (req, res, next) => {
  // Check from coupon name
  const coupon = await Coupon.findOne({
    name: req.body.name,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiErrors("Coupon is invalid", 401));
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiErrors("Cart is empty", 401));
  }
  // check for product id equal product is in coupon
  let total = [];
  cart.cartItems.forEach((item) => {
    total.push(item.product.toString());
  });
  const filter = total.filter((item) => item === coupon.product.toString());
  if (!filter.toString()) {
    return next(new ApiErrors("Coupon is invalid", 401));
  }
  const product = await Products.findById(filter.toString());
  calc(cart);
  const calculate = (product.price * coupon.discount) / 100;
  cart.totalAfterDiscount = (cart.totalPrice - calculate).toFixed(2);
  await cart.save();
  res.status(200).json({ result: cart.cartItems.length, data: cart });
});
// DELETE
/*
 * @desc    Delete cart
 * @route   DELETE   /api/v1/cart:id
 * @access  Auth(User)
 * */
exports.clearCart = expressAsyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
/*
 * @desc    Delete cart
 * @route   DELETE   /api/v1/cart:id
 * @access  Auth(User)
 * */
exports.deleteOneCart = expressAsyncHandler(async (req, res, next) => {
  console.log(req.user._id.toString());
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  );
  calc(cart);
  await cart.save();
  res.status(204).send();
});
