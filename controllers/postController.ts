import { Request, Response } from "express";
import fs from "fs";
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
  const baseUrl = req.protocol + "://" + req.get("host");
  const filePath = `${baseUrl}/${req.file.path}`;

  try {
    const post = new Post({ ...req.body, image_full_url: filePath, image: req.file.path, user: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
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
  const baseUrl = req.protocol + "://" + req.get("host");
  try {
    let updateData = { ...req.body };
    // Eğer yeni bir fotoğraf yüklenmişse
    if (req?.file) {
      const filePath = `${baseUrl}/${req.file.path}`;
      updateData.image = req.file.path;
      updateData.image_full_url = filePath;
      const oldPost = await Post.findById(req.params.id);
      if (oldPost && oldPost.image) {
        const oldFilePath = oldPost.image;
        if (oldFilePath) {
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Fotoğraf silinirken hata oluştu:", err);
            } else {
              console.log("Fotoğraf başarıyla silindi");
            }
          });
        }
      }
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
    const postToDelete = await Post.findById(req.params.id);

    if (postToDelete && postToDelete.image) {
      fs.unlink(postToDelete.image, (err) => {
        if (err) {
          console.error("Fotoğraf silinirken hata oluştu:", err);
        } else {
          console.log("Fotoğraf başarıyla silindi");
        }
      });
    }
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post bulunamadı." });
    }
    res.json({ message: "Post başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: "Post silinemedi." });
  }
};
