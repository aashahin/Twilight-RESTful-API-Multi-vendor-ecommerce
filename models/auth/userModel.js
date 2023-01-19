const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name Required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email Required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Required"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExp: Date,
    passwordResetVerified: Boolean,
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin", "vendor", "user"],
      default: "user",
    },
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
      },
    ],
      addresses:{
          id: {type: mongoose.Schema.Types.ObjectId},
          details:String,
          alias:String,
          city: String,
          phone: Number,
          postalCode: Number,
      }
  },
  { timestamps: true }
);
//Encrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Processing Images
const imgURL = (doc) => {
  if (doc.profileImage) {
    doc.profileImage = `${process.env.BASE_URL}/users/${doc.profileImage}`;
  }
};
// findOne, findAll and update
userSchema.post("init", (doc) => {
  imgURL(doc);
});

// create
userSchema.post("save", (doc) => {
  imgURL(doc);
});
exports.UserModel = mongoose.model("User", userSchema);
