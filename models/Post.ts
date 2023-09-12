import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true, // Otomatik olarak oluşturma ve güncelleme tarihlerini ekler
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
