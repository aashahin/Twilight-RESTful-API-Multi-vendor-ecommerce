const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory name required"],
      minLength: [2, "Minimum: 2"],
      maxLength: [18, "Maximum:18"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "parent category required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("SubCategory", subCategorySchema);
