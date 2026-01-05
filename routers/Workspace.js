import { Router } from "express";
import WorkspaceController from "../controllers/Workspace.js";
import { upload } from "../utils/upload.js";

const router = Router();

// Регистрация workspace (с загрузкой логотипа)
router.post("/register", upload.single('logo'), WorkspaceController.register);

// Получить workspace по userId
router.get("/user/:userId", WorkspaceController.getWorkspaceByUserId);

// Получить workspace по ID
router.get("/:id", WorkspaceController.getWorkspace);

// Обновить workspace (с возможностью загрузки логотипа)
router.put("/:id", upload.single('logo'), WorkspaceController.updateWorkspace);

export default router;
