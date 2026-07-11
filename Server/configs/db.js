import mongoose from 'mongoose'

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        // 💡 Simple fix: Extra config/strings hata kar direct URI pass karo
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;