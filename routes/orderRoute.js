const express = require("express"),
  router = express.Router();
const {
  createCashOrder,
  getOrder,
  getOrders,
  filter,
  getVendorOrders,
  updateOrder,
  updateDeliveryOrder,
  updatePayOrder,
} = require("../services/orderServices");
const { auth, permissions } = require("../services/auth/authService");

router.route("/").get(auth, permissions("admin", "user"), filter, getOrders);
router
  .route("/vendor")
  .get(auth, permissions("vendor"), filter, getVendorOrders);
router
  .route("/:id")
  .get(auth, permissions("admin", "vendor", "user"), getOrder)
  .post(auth, permissions("user"), createCashOrder)
  .put(auth, permissions("admin"), updateOrder);
router
  .route("/:id/paid")
  .put(auth, permissions("admin", "vendor"), updatePayOrder);
router
  .route("/:id/delivered")
  .put(auth, permissions("admin", "vendor"), updateDeliveryOrder);
module.exports = router;
