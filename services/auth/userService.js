const {
  deleteOne,
  createOne,
  getOne,
  getAll,
} = require("../../models/handlerFactory");
const { uploadSingleImage } = require("../../middlewares/images/upImages");
const expressAsyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { UserModel } = require("../../models/auth/userModel");
const asyncHandler = require("express-async-handler");
const apiErrors = require("../../utils/apiErrors");
const bcrypt = require("bcryptjs");
const { createToken } = require("../../utils/auth/token");
const {v4: uuidv4} = require("uuid");

exports.uploadImages = uploadSingleImage("profileImage");
exports.processImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .toFile(`uploads/users/${filename}`);
    req.body.profileImage = filename;
  }
  next();
});
// POST
/*
 * @desc    Create User
 * @route   POST   /api/v1/users
 * @access  Private
 * */
exports.createUser = createOne(UserModel);

// GET
/*
 * @desc   List of Users
 * @route  GET /api/v1/users
 * @access Private
 * */
exports.getUsers = getAll(UserModel);

/*
 *  @desc    Get Specific User By Id
 *  @route   GET /api/v1/users/:id
 *  @access  Private
 * */
exports.getUser = getOne(UserModel, `No User for this id: `);

/*
 *  @desc   Get logged User data
 *  @route  DELETE /api/v1/users/get-me
 *  @access Private/Logged
 * */
exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// PUT
/*
 *  @desc   Update Specific user
 *  @route  PUT /api/v1/users/:id
 *  @access Private
 * */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      active: req.body.active,
      role: req.body.role,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new apiErrors(`No User for this id: `, 404));
  } else {
    return res.status(200).json({ data: document });
  }
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new apiErrors(`No User for this id: `, 404));
  } else {
    return res.status(200).json({ data: document });
  }
});

/*
 *  @desc   Update Logged User Password
 *  @route  DELETE /api/v1/users/change-password
 *  @access Private/Logged
 * */
exports.updateLoggedUserPassword = expressAsyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      { new: true }
    );
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
  }
);

/*
 *  @desc   Update Logged User Info
 *  @route  DELETE /api/v1/users/update-profile
 *  @access Private/Logged
 * */
exports.updateProfile = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    { new: true }
  );
  res.status(200).json({ data: user });
});
// DELETE
/*
 *  @desc   Delete Specific User
 *  @route  DELETE /api/v1/users/:id
 *  @access Private
 * */

exports.deleteUser = deleteOne(UserModel, `No User for this id: `, 400);

// Wishlist
/*
 * @desc    Add to favorites
 * @route   POST   /api/v1/favorites
 * @access  Auth
 * */
exports.addProductFavorite = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { favorites: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    msg: "Added to favorites",
    data: document.favorites,
  });
});

/*
 * @desc    Get favorites
 * @route   GET   /api/v1/favorites/
 * @access  Auth
 * */
exports.getFavorites = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("favorites");
  res.status(200).json({ result: user.favorites.length, data: user.favorites });
});

/*
 * @desc    Removed from favorites
 * @route   DELETE   /api/v1/favorites/:id
 * @access  Auth
 * */
exports.removeProductFavorite = expressAsyncHandler(async (req, res, next) => {
   await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { favorites: req.params.id },
    },
    { new: true }
  );
  res.status(204).json({ status: "Success", msg: "Removed from favourites" });
});

// Addresses
/*
 * @desc    Add  Address
 * @route   POST   /api/v1/addresses
 * @access  Auth
 * */
exports.addAddress = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
          addresses: {
              details: req.body.details,
              alias: req.body.alias,
              city: req.body.city,
              phone: req.body.phone,
              postalCode: req.body.postalCode,
          }

      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    msg: "Added Address to Your Addresses",
    data: document.addresses,
  });
});

/*
 * @desc    Get Addresses
 * @route   GET   /api/v1/addresses/
 * @access  Auth
 * */
exports.getAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("addresses");
  res.status(200).json({ data: user.addresses });
});

/*
 * @desc    Removed for Addresses
 * @route   DELETE   /api/v1/addresses/:id
 * @access  Auth
 * */
exports.removeAddress = expressAsyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: {_id: req.params.id} },
    },
    { new: true }
  );
  res.status(204).json({ status: "Success", msg: "Removed from addresses" });
});
