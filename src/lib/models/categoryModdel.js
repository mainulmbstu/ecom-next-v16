// const mongoose = require("mongoose");
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    slug: { type: String, lowercase: true },
    parentId: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", //collection name in mongoose.model('User', userSchema)
      required: true,
    },
    picture: {
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/dgj1icpu7/image/upload/v1739850899/dir0m1r7wi2bphos1uqk.jpg",
      },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

export const CategoryModel =
  mongoose.models?.Category || mongoose.model("Category", categorySchema);
