import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d', // 15일 뒤 만료
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // XSS 예방
        sameSite: "strict", // CSRF 예방
        secure: process.env.NODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookie;