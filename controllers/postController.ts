import { Request, Response } from "express";
import Post from "../models/Post";

export const listPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1; // Şu anki sayfa numarası
  const limit = Number(req.query.limit) || 10; // Bir sayfada gösterilecek post sayısı
  const skip = (page - 1) * limit; // Atlanacak post sayısı
  try {
    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .populate("category")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({
      totalPages: Math.ceil(totalPosts / limit), // Toplam sayfa sayısı
      currentPage: page,
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: "Postlar listelenemedi." });
  }
};

// Yeni Post Oluşturma
export const createPost = async (req: Request, res: Response) => {
  try {
    const post = new Post({ ...req.body, user: req.user?._id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log("req.user:", req.user);
    res.status(500).json({ error: "Post oluşturulamadı." });
  }
};

export const showPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("category");
    if (!post) {
      return res.status(404).json({ error: "Post bulunamadı." });
    }
    res.json(post);
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ error: "Post bulunamadı." });
    }
    res.status(500).json({ error: "Post bulunamadı." });
  }
};

// Post Güncelleme
export const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ error: "Post bulunamadı." });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Post güncellenemedi." });
  }
};

// Post Silme
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post bulunamadı." });
    }
    res.json({ message: "Post başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: "Post silinemedi." });
  }
};
