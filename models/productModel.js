const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product Title is Required"],
      trim: true,
      minLength: [5, "Minimum Words is 5"],
      maxLength: [70, "Maximum Words is 70"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is Required"],
      minLength: [50, "Minimum Words is 50"],
      maxLength: [1000, "Maximum Words is 1000"],
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product Price is Required"],
      trim: true,
      max: [1000000, "Maximum Price is 1000000"],
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      max: [100, "Maximum Discount is 100"],
    },
    colors: [String],
    images: [
      {
        type: String,
        required: [true, ["Product Images is Required"]],
      },
    ],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is Required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Please Select Category for product"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating Must Be Above or equal 1.0"],
      max: [5, "Rating Must Be Below or equal 1.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Build Virtual Populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

const imgURL = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/products/${doc.imageCover}`;
  }
  if (doc.images) {
    const arr = [];
    doc.images.forEach((image) => {
      const imgURL = `${process.env.BASE_URL}/products/${image}`;
      arr.push(imgURL);
    });
    doc.images = arr;
  }
};
productSchema.post("init", (doc) => {
  imgURL(doc);
});

productSchema.post("save", (doc) => {
  imgURL(doc);
});
module.exports = mongoose.model("Products", productSchema);
