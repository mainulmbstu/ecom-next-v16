import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId, // or mongoose.ObjectId
      ref: "Category", //collection name in mongoose.model('categories', categorySchema)
    },
    price: { type: Number, required: true },
    offer: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    color: [{ type: String }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    picture: {
      type: Array,
      default: [
        {
          secure_url:
            "https://res.cloudinary.com/dgj1icpu7/image/upload/v1739850899/dir0m1r7wi2bphos1uqk.jpg",
        },
      ],
    },

    amount: { type: Number, default: 1 },
    review: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingNo: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models?.products || mongoose.model("products", productSchema);
