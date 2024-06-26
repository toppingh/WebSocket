import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessages = async (req, res) => {
    try {
        const {message} = req.body; // input으로 유저에게 메세지를 받으면
        const {id: receiverId} = req.params; // 받는 사람의 아이디를 params를 이용해 가져오고
        const senderId = req.user._id; // protectRoute를 이용해 req.user아이디를 가져와 보낸 사람을 알수있음

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

        // Socket IO 부분

        // conversation 저장 후 newMessage 저장
        // await conversation.save(); // 디비에 저장
        // await newMessage.save(); // 디비에 저장

        // 병렬로 처리
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(`sendMessages 컨트롤러에서 에러 발생 : ${error.message}`);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // Message 모델에서 실제 메시지를 가져와 Conversation 문서와 함께 반환
        // 참조가 아닌 실제 메세지를 가져옴
        
        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.error(`getMessages 컨트롤러에서 에러 발생 : ${error.message}`);
        res.status(500).json({error: "Internal server error"});
    }
} 