import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    replies: [
      {
        userName: String,
        msg: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);
export const ContactModel =
  mongoose.models?.contacts || mongoose.model("contacts", contactSchema);
//=============================
const contactReplySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    reply: { type: String, required: true },
    msgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contact", //collection name in mongoose.model('user', userSchema)
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", //collection name in mongoose.model('user', userSchema)
      required: true,
    },
  },
  { timestamps: true }
);
export const ContactReplyModel =
  mongoose.models?.contactReplies ||
  mongoose.model("contactReplies", contactReplySchema);
