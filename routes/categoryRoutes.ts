import express from "express";
import * as categoryController from "../controllers/categoryController";

const router = express.Router();

router.get("/", categoryController.listCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
