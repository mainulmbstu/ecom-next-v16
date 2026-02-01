// const mongoose = require("mongoose");
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    verifyTokenExpire: { type: Date },
    OTP: { type: Number },
    OTPExpire: { type: Date },
    picture: {
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/dgj1icpu7/image/upload/v1731421057/ks1yrpyy3iy2rzpp2m4c.jpg",
      },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models?.users || mongoose.model("users", userSchema);
