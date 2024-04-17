import express from "express";
import { sendMessage } from "./controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage); //  protectRoute를 호출하면 next() 함수실행

export default router;