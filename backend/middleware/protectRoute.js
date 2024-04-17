import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "인증 실패 - 토큰이 제공되지 않았습니다." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "인증 실패 - 유효하지 않은 토큰입니다." });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "유저를 찾을 수 없습니다." });
        }

        req.user = user;
        
        next();
    } catch (error) {
        console.error(`protectRoute middleware에서 에러 발생 : ${error.message}`);
        res.status(500).json({error: "Internal server error"});
    }
}

export default protectRoute;