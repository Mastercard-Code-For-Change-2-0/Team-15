import express from "express";
import { askGemini } from "../Controllers/chatController.js";

const router = express.Router();
router.post("/ask", askGemini);

export default router;
