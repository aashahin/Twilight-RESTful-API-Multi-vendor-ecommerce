const asyncHandler = require("express-async-handler");
const apiErrors = require("../utils/apiErrors");
const ApiFeatures = require("../utils/apiFeatures");
const productModel = require("./productModel");
const Order = require("../models/orderModel");

// Create
exports.createOne = (model, reviews, products, coupons) => {
  return asyncHandler(async (req, res) => {
    if (reviews) {
      const document = await model.create({
        content: req.body.content,
        ratings: req.body.ratings,
        product: req.body.product,
        user: req.user._id.toString(),
      });
      return res.status(201).json({ data: document });
    }
    if (products) {
      const document = await model.create({
        user: req.user._id,
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        quantity: req.body.quantity,
        sold: req.body.sold,
        price: req.body.price,
        discount: req.body.discount,
        colors: req.body.colors,
        images: req.body.images,
        imageCover: req.body.imageCover,
        category: req.body.category,
        subcategories: req.body.subcategories,
        brand: req.body.brand,
        ratingsAverage: req.body.ratingsAverage,
        ratingsQuantity: req.body.ratingsQuantity,
      });
      return res.status(201).json({ data: document });
    }
    if (coupons) {
      const document = await model.create({
        name: req.body.name,
        discount: req.body.discount,
        expire: req.body.expire,
        product: req.body.product,
        user: req.user._id,
      });
      return res.status(201).json({ data: document });
    }
    const document = await model.create(req.body);
    return res.status(201).json({ data: document });
  });
};

// GetOne
exports.getOne = (model, msgErr, population) => {
  return asyncHandler(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (population) {
      query = query.populate(population);
    }
    const document = await query;
    if (!document) {
      return next(new apiErrors(`${msgErr}${req.params.id}`, 404));
    } else {
      return res.status(200).json({ data: document });
    }
  });
};

// GetAll
exports.getAll = (model, products, vendor, cart) => {
  return asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    let count = await model.countDocuments();
    let apiFeatures;
    if (products) {
      apiFeatures = new ApiFeatures(model.find(), req.query)
        .sort()
        .filter()
        .paginate(count)
        .limitFields()
        .search(true)
        .select();
    }
    if (vendor) {
      const count = await model.countDocuments({ user: req.user._id });
      apiFeatures = new ApiFeatures(
        productModel.find({ user: req.user._id }),
        req.query
      )
        .filter()
        .paginate(count)
        .limitFields()
        .search(true)
        .select();
      const { pagination, mongooseQuery } = apiFeatures;
      const document = await mongooseQuery;
      return res
        .status(200)
        .json({ result: document.length, pagination, data: document });
    }
    // Show Orders for vendor
    if (cart) {
      let order = await Order.find(filter);
      let document = []; // push documents
      for (const item of order) {
        //this working
        if (item.cartItems[0].vendor === req.user._id.toString()) {
          filter = { user: req.user._id };
        }
        const product = await item.cartItems.find((item) => item.vendor === String(req.user._id));
        if (product) {
          document.push(product);
        }
      }

      count = document.length;

      apiFeatures = new ApiFeatures(model.find(filter), req.query)
        .sort()
        .paginate(count)
        .limitFields()
        .search()
        .select();
      const { pagination } = apiFeatures;
      return res
        .status(200)
        .json({ result: document.length, pagination, data: document });
    }
    apiFeatures = new ApiFeatures(model.find(filter), req.query)
        .sort()
        .paginate(count)
        .limitFields()
        .search()
        .select();
    const { pagination, mongooseQuery } = apiFeatures;
    const document = await mongooseQuery;
    return res
      .status(200)
      .json({ result: document.length, pagination, data: document });
  });
};

// Update
exports.updateOne = (model, msgErr, reviews) =>
  asyncHandler(async (req, res, next) => {
    if (reviews) {
      const document = await model.findByIdAndUpdate(
        req.params.id,
        {
          content: req.body.content,
          ratings: req.body.ratings,
        },
        {
          new: true,
        }
      );
      document.save();
      return res.status(201).json({ data: document });
    }
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new apiErrors(`${msgErr}${req.params.id}`, 404));
    } else {
      document.save();
      return res.status(200).json({ data: document });
    }
  });

// Delete
exports.deleteOne = (model, msgErr, msgSucc) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(
      id.match(/^[0-9a-fA-F]{24}$/)
    );
    if (!document) {
      return next(new apiErrors(`${msgErr}${req.params.id}`, 404));
    } else {
      document.remove();
      return res.status(204).send(msgSucc);
    }
  });
