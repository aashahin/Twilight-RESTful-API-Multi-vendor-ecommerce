const multer = require("multer");
const ApiErrors = require("../../utils/apiErrors");
const options = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiErrors("Only Image Allowed", 400), false);
    }
  };
  return multer({ storage: multerStorage, fileFilter: multerFilter });
};
exports.uploadSingleImage = (field) => {
  return options().single(field);
};
exports.uploadMultiImages = (fields) => {
  return options().fields(fields);
};
