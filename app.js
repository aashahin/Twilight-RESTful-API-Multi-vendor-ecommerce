const express = require("express"),
  app = express(),
  dotenv = require("dotenv"),
  morgan = require("morgan"),
  compression = require("compression"),
  cors = require("cors"),
  rateLimit = require("express-rate-limit"),
  hpp = require("hpp"),
  xssClean = require("xss-clean"),
  mongoSanitize = require("express-mongo-sanitize"),
  helmet = require("helmet"),
{ dbConnection } = require("./config/database"),
  { globalErrors } = require("./middlewares/globalErrors"),
  ApiErrors = require("./utils/apiErrors"),
  routes = require("./routes");

// Import ENV
dotenv.config({ path: "config.env" });

// Security
// CORS Enable on Domain Limit
const corsOptions = {
  origin: process.env.BASE_URL,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Limit each IP to limit requests
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 500, // Limit each IP to 200 create account requests per `window` (here, per hour)
  message:
    "Too many accounts created from this IP, please try again after 30 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Limit for Auth
const limiterAuth = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // Limit each IP to 200 create account requests per `window` (here, per hour)
  message:
    "Too many accounts created from this IP, please try again after 30 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// MiddleWares
// limit requests
app.use(express.json({ limit: "50kb" }));
// Mongo Sanitize
app.use(mongoSanitize());
// Helmet
app.use(helmet());
// XSS Clean
app.use(xssClean());
// Limit each IP to limit requests
app.use("/api", limiter);
app.use("/api/v1/auth/", limiterAuth);
// Compression for requests and CORS for all routes
app.use(compression(), cors(corsOptions));
// HPP
app.use(hpp());

// Allow access to static files
app.use(express.static("./uploads"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// DB Connection
dbConnection();

// Routes
routes(app, express);

// Handling Errors MiddleWares
app.all("*", (req, res, next) => {
  next(new ApiErrors(`Can't Find This Route: ${req.originalUrl}`, 400));
});

app.use(globalErrors);
// Run Server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Run Server With ${port}`);
});

// UnhandledRejection Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors ${err}`);
  server.close(() => {
    console.log(`ShutDown The Server.`);
    process.exit(1);
  });
});
