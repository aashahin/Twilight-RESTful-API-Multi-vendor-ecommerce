const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiErrors = require("../utils/apiErrors");
const { getAll } = require("../models/handlerFactory");

// show orders for user
exports.filter = expressAsyncHandler((req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
});
// POST
/*
 * @desc    Create Cash order
 * @route   POST   /api/v1/order/:cartId
 * @access  Auth(User)
 * */
exports.createCashOrder = expressAsyncHandler(async (req, res, next) => {
  // UI settings
  // const taxPrice = 0;
  // const shoppingPrice = 0;

  // Get Cart
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    return next(new ApiErrors("Invalid cart id", 404));
  }

  // Get cart price and set total + tax + shopping price for order
  const totalOrderPrice =
    cart.totalAfterDiscount !== undefined
      ? cart.totalAfterDiscount
      : cart.totalPrice; //cartPrice + taxPrice + shoppingPrice
  // Create Order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
  });
  // decrement product quantity
  if (order) {
    const bulkWriteOperation = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkWriteOperation, {});

    // Clear cart after product order
    await Cart.findOneAndDelete(req.params.id);
  }
  res.status(201).json({ data: order });
});
// GET
/*
 * @desc    Get orders
 * @route   GET   /api/v1/order/
 * @access  Auth(All)
 * */
exports.getOrders = getAll(Order);
/*
 * @desc    Get orders
 * @route   GET   /api/v1/order/vendor
 * @access  Auth(Vendor)
 * */
exports.getVendorOrders = getAll(Order, false, false, true);
/*
 * @desc    Get order
 * @route   GET   /api/v1/order/id
 * @access  Auth(All)
 * */
exports.getOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.find({});
  const document = [];
  for (const item of order) {
    const id = item.cartItems.filter(
      (item) => item._id.toString() === req.params.id
    );
    if (id.length !== 0) {
      document.push(...id);
    }
  }
  if (!order) {
    return next(
      new ApiErrors(`Not found order by this id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: document });
});

// PUT
/*
 * @desc    Order update
 * @route   GET   /api/v1/order/id
 * @access  Auth(admin)
 * */
exports.updateOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.find({});
  if (!order) {
    return next(
      new ApiErrors(`Not found order by this id: ${req.params.id}`, 404)
    );
  }
  const document = [];
  for (const item of order) {
    const id = item.cartItems.filter(
      (item) => item._id.toString() === req.params.id
    );
    if (id.length !== 0) {
      document.push(...id);
      document[0].paidAt = Date.now();
      document[0].isPaid = req.body.isPaid;
      document[0].deliveredAt = Date.now();
      document[0].isDelivered = req.body.isDelivered;
      await item.save();
    }
  }
  res.status(200).json({ data: document });
});
/*
 * @desc    Pay update
 * @route   GET   /api/v1/order/id/paid
 * @access  Auth(admin,vendor)
 * */
exports.updatePayOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.find({});
  if (!order) {
    return next(
      new ApiErrors(`Not found order by this id: ${req.params.id}`, 404)
    );
  }
  const document = [];
  for (const item of order) {
    const id = item.cartItems.filter(
      (item) => item._id.toString() === req.params.id
    );
    if (id.length !== 0) {
      document.push(...id);
      document[0].paidAt = Date.now();
      document[0].isPaid = true;
      await item.save();
    }
  }
  res.status(200).json({ data: document });
});
/*
 * @desc    Delivery update
 * @route   GET   /api/v1/order/id/delivered
 * @access  Auth(admin,vendor)
 * */
exports.updateDeliveryOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.find({});
  if (!order) {
    return next(
      new ApiErrors(`Not found order by this id: ${req.params.id}`, 404)
    );
  }
  const document = [];
  for (const item of order) {
    const id = item.cartItems.filter(
      (item) => item._id.toString() === req.params.id
    );
    if (id.length !== 0) {
      document.push(...id);
      document[0].deliveredAt = Date.now();
      document[0].isDelivered = true;
      await item.save();
    }
  }

  res.status(200).json({ data: document });
});
