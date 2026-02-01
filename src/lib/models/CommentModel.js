// const mongoose = require("mongoose");
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products", //collection name in mongoose.model('users', userSchema)
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", //collection name in mongoose.model('users', userSchema)
      required: true,
    },
  },
  { timestamps: true }
);

export const CommentModel =
  mongoose.models?.comments || mongoose.model("comments", commentSchema);
