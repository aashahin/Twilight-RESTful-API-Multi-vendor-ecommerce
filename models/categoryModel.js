const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
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
    doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  }
};
// findOne, findAll and update
categorySchema.post("init", (doc) => {
  imgURL(doc);
});

// create
categorySchema.post("save", (doc) => {
  imgURL(doc);
});
module.exports = mongoose.model("category", categorySchema);
