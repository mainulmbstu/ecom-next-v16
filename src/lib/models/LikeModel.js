// const mongoose = require("mongoose");
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    status: { type: Boolean, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products", //collection name in mongoose.model('users', userSchema)
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const LikeModel =
  mongoose.models?.Like || mongoose.model("Like", likeSchema);
