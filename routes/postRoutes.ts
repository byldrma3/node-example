import express from "express";
import * as postController from "../controllers/postController";

const router = express.Router();

router.get("/", postController.listPosts);
router.post("/", postController.createPost);
router.get("/:id", postController.showPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

export default router;
