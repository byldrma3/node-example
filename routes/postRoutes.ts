import express from "express";
import * as postController from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.get("/", postController.listPosts);
router.post("/", protect, upload.single("image"), postController.createPost);
router.get("/:id", postController.showPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;
