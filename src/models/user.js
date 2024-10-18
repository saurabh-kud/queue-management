const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      require: [true, "pls enter your first name"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [isEmail, "invalid email"],
    },

    password: {
      type: String,
      required: "password required",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
