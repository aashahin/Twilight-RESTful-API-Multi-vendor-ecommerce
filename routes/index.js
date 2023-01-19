const compression = require("compression");
const cors = require('cors')
const userRoute = require("./auth/userRoute"),
  authRoute = require("./auth/authRoute"),
  categoryRoute = require("./categoryRoute"),
  subCategoryRoute = require("./subCategoryRoute"),
  brandRoute = require("./brandRoute"),
  productsRoute = require("./productRoute"),
  reviewRoute = require("./reviewRoute"),
  couponRoute = require("./couponRoute"),
  cartRoute = require("./cartRoute"),
  orderRoute = require("./orderRoute");

const corsOptions = {
  origin: process.env.BASE_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
function routes(app) {
  app.use(compression(),cors(corsOptions));
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth/", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productsRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
}
module.exports = routes;
