import mongoose from 'mongoose'

const connectDB = async () => {
    // Agar pehle se connected hai toh dubara connect mat karo (Serverless cleanup)
    if (mongoose.connection.readyState === 1) {
        console.log("Database already connected");
        return;
    }

    try {
        // Direct connect karo aur string check karo
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/greencart`);
        console.log(`Database Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Agar fail ho toh function wahi crash ho taaki timeout na ho
    }
}

export default connectDB;