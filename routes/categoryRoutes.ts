import express from "express";
import * as categoryController from "../controllers/categoryController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", categoryController.listCategories);
router.post("/", protect, categoryController.createCategory);
router.put("/:id", protect, categoryController.updateCategory);
router.delete("/:id", protect, categoryController.deleteCategory);

export default router;
