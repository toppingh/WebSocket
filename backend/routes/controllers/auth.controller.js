import bcryptjs from "bcryptjs";
import User from "../../models/user.model.js";
import generateTokenAndSetCookie from "../../utils/generateToken.js";

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
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

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

export const login = (req, res) => {
    console.log("loginUser");
}

export const logout = (req,res) => {
    console.log("logoutUser");
}