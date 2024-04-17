import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js"

// 회원가입 요청 및 응답
export const signup = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender}  = req.body;

        if (password != confirmPassword) {
            return res.status(400).json({
                error: "비밀번호가 일치하지 않습니다."
            })
        }

        const user = await User.findOne({username});

        if (user) {
            return res.status(400).json({
                error: "이미 있는 닉네임입니다."
            })
        }

        // HASH PW
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 아바타 사진 api : https://avatar.iran.liara.run/
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // 새로운 유저 
        const newUser = new User ({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        if (new User) {
            // JWT
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save(); // DB에 유저 저장

            // 저장될 유저 정보
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({error: "유효하지 않습니다."});
        }

    } catch (error) {
        console.log(`회원가입 실패 : ${error.message}`);
        res.status(500).json({error: "Internal Server Error"});
    }
};

// 로그인 요청 및 응답
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "닉네임이나 비밀번호가 올바르지않습니다."});
        }

        generateTokenAndSetCookie(user._id, res); // 토큰 + 쿠키 셋팅

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error(`로그인 에러 발생 : ${error.message}`);
        res.status(500).json({error: "Internal Server Error"});
    }
}

// 로그아웃 요청 및 응답
export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0}); // 로그아웃 요청시 쿠키를 빈 문자열로
        res.status(200).json({message: "로그아웃 완료!"});
    } catch (error) {
        console.log(`로그아웃 에러 발생 : ${error.message}`);
        res.status(500).json({error:"Internal Server Error"});
    }
}