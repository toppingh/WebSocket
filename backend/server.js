import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from './routes/message.routes.js';
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 4000;dotenv.config();

app.use(express.json()); // JSON 구문 분석 (req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes); // routes/auth.routes.js 파일 사용
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//     // root route http://localhost:4000/
//     res.send("Hello!!");
// })



app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});