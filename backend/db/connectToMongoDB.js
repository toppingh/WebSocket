import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("MongoDB 연결 성공");
    } catch (error) {
        console.error("MongoDB 연결 중 에러 발생", error.message);
    }
};

export default connectToMongoDB;