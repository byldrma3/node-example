import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Kategori adı zorunludur."],
    unique: true,
    trim: true,
    maxlength: [40, "Kategori adı 40 karakterden uzun olamaz."],
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
