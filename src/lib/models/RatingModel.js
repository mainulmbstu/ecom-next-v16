// const mongoose = require("mongoose");
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true },
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

export const RatingModel =
  mongoose.models?.ratings || mongoose.model("ratings", ratingSchema);
