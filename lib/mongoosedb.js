import mongoose from "mongoose";

const connectionToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MongoURL)
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error(`Error connecting to database: ${err}`);
    }
}

export default connectionToDatabase;