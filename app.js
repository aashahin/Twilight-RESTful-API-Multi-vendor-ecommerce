const express = require("express"),
  app = express(),
  dotenv = require("dotenv"),
  morgan = require("morgan"),
  { dbConnection } = require("./config/database"),
  ApiErrors = require("./utils/apiErrors");
const { globalErrors } = require("./middlewares/globalErrors");
const routes = require("./routes");

// Import ENV
dotenv.config({ path: "config.env" });

// MiddleWares
app.use(express.json());
app.use(express.static("./uploads"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// DB Connection
dbConnection();

// Routes
routes(app,express);

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
