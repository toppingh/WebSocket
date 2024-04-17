import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const {message} = req.body; // input으로 유저에게 메세지를 받으면
        const {id: receiverId} = req.params; // 받는 사람의 아이디를 params를 이용해 가져오고
        const {senderId} = req.user._id; // protectRoute를 이용해 req.user아이디를 가져와 보낸 사람을 알수있음

        //  두 유저가 서로 대화한적 있는지 체크 (찾음)
        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]},
        });

        // 만약 없으면 participants로 새로 생성
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // 새로운 메세지를 만들고
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // 이 메세지 전송
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
};