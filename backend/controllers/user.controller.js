import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // 전체 유저를 불러오지만 password는 제외한 전체 유저 정보
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error(`getUserForSidebar에서 에러 발생 : ${error.message}`);
        res.status(500).json({ error: "Internal server error"} );
    }
}