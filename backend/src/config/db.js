import mongoose from "mongoose";
import logger from "./logger.js"
import {Error} from "mongoose";

const connection = async()=>{
    try{
        /*const conn = await mongoose.connect(process.env.MONGODB_URI , {
            socketTimeoutMS: 50000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority',
        });*/
        //const mongoose = require('mongoose');
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MongoDB connection URI is not defined');
        }

        const conn = mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('MongoDB connection error:', err));

        logger.info(`Connected to MongoDB server : ${conn.connection.host}`);
        return conn;
    } catch (error){
        logger.error(`Error connecting to MongoDB server : ${error.message}`);
        process.exit(1);
    }
};
export default connection;
