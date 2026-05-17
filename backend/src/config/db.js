import mongoose from "mongoose";
import logger from "./logger.js"

const connection = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI , {
            socketTimeoutMS: 50000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority',
        });

        logger.info(`Connected to MongoDB server : ${conn.connection.host}`);
        return conn;
    } catch (error){
        logger.error(`Error connecting to MongoDB server : ${error.message}`);
        process.exit(1);
    }
};
export default connection;
