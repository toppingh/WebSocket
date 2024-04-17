import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // 송신자 Id
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User 모델의 아이디 참조
        required: true
    },

    // 수신자 Id
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User 모델의 아이디 참조
        required: true
    },

    message: {
        type: String,
        required: true
    }

    // createdAt, updatedAt
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);

export default Message;