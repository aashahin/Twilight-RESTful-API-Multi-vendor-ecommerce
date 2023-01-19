const jwt = require("jsonwebtoken");
exports.createToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRESIN,
  });
};
