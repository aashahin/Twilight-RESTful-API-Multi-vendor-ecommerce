const express = require("express"),
  router = express.Router();
const {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  changePasswordValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../../utils/validator/auth/userValidator");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadImages,
  processImage,
  changePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateProfile,
  addProductFavorite,
  getFavorites,
  removeProductFavorite,
  removeAddress,
  addAddress,
  getAddresses,
} = require("../../services/auth/userService");
const { auth, permissions } = require("../../services/auth/authService");

// Favorites
router
  .route("/favorites")
  .get(auth, permissions("user", "vendor", "admin"), getFavorites)
  .post(auth, permissions("user", "vendor", "admin"), addProductFavorite);
router.delete(
  "/favorites/:id",
  auth,
  permissions("user", "vendor", "admin"),
  removeProductFavorite
);

// Addresses
router
  .route("/addresses")
  .get(auth, permissions("user", "vendor", "admin"), getAddresses)
  .post(auth, permissions("user", "vendor", "admin"), addAddress);
router.delete(
  "/addresses/:id",
  auth,
  permissions("user", "vendor", "admin"),
  removeAddress
);
// Logged User
router.get("/get-me", auth, getLoggedUserData, getUser);
router.put(
  "/change-password",
  auth,
  changeUserPasswordValidator,
  updateLoggedUserPassword
);
router.put("/update-profile", auth, updateLoggedUserValidator, updateProfile);

// Admin
router
  .route("/")
  .get(auth, permissions("admin", "vendor", "user"), getUsers)
  .post(
    auth,
    permissions("admin"),
    uploadImages,
    processImage,
    createUserValidator,
    createUser
  );

router.put(
  "/change-password/:id",
  auth,
  permissions("admin"),
  changePasswordValidator,
  changePassword
);
router
  .route("/:id")
  .get(auth, permissions("admin"), getUserValidator, getUser)
  .put(
    auth,
    permissions("admin"),
    uploadImages,
    processImage,
    updateUserValidator,
    updateUser
  )
  .delete(auth, permissions("admin"), deleteUserValidator, deleteUser);

module.exports = router;
