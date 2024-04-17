import express from "express";
import { sendMessages, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); //  protectRoute를 호출하면 next() 함수실행
router.post("/send/:id", protectRoute, sendMessages); //  protectRoute를 호출하면 next() 함수실행

export default router;