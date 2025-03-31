import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    }
    catch (err) {
        console.error("MONGODB ERROR", err);
        process.exit(1);
    }
}

export default connectDB;