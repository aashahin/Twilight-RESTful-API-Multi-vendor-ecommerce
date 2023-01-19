const ApiErrors = require("../utils/apiErrors");
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    // name:err.name,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
const jwtVerify = () => {
  return new ApiErrors("Invalid Token", 401);
};
exports.globalErrors = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = jwtVerify();
    }
    sendErrorProd(err, res);
  }
  next();
};
