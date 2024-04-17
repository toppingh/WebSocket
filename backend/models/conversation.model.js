import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: [], // 메세지를 보낼 때 기본적으로 비어있음
            },
        ],
    },
    { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;