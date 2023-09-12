import { Request, Response } from "express";
import Category from "../models/Category";

export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Kategoriler listelenemedi." });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Kategori oluşturulamadı." });
  }
};

// Kategori Güncelleme
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ error: "Kategori bulunamadı." });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Kategori güncellenemedi." });
  }
};

// Kategori Silme
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Kategori bulunamadı." });
    }
    res.json({ message: "Kategori başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: "Kategori silinemedi." });
  }
};
