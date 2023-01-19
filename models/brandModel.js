const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Require"],
      unique: [true, "Must be Unique"],
      minimum: [3, "Words Minimum is 3"],
      maximum: [32, "Words Maximum is 32"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const imgURL = (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}/brands/${doc.image}`;
  }
};
// findOne, findAll and update
brandSchema.post("init", (doc) => {
  imgURL(doc);
});

// create
brandSchema.post("save", (doc) => {
  imgURL(doc);
});
module.exports = mongoose.model("Brand", brandSchema);
