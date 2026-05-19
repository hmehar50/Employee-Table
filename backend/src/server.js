import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import * as http from "node:http";
import morgan from "morgan";
import logger from "./config/logger.js";
import dotenv from 'dotenv';
//import * as Date from "mongoose/types/helpers";
import employeeRoutes from "./routes/employeeRoutes.js";
import {handleError, notFoundHandler} from "./middleware/middleware.js";
import connectDB from "./config/db.js";

//const express = require("express");
//const cors = require("cors");
//const helmet = require("helmet");
//const morgan = require("morgan");
//const rateLimit = require("express-rate-limit");
//const logger =  require("./config/logger");
//const employeeRoutes = require("./routes/employeeRoutes");
//const connectDB = require("./config/db");
//const {handleError, notFoundHandler} = require("./middleware/middleware");


const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost',

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'AuthorizationHeader'],


};
app.use(cors(corsOptions));
app.use(morgan('combined' , {stream: {write: (msg)=>logger.info(msg)}}));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({limit:'10mb' , extended: true }));

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUEST),
    message: 'too many request try after sometime',
    legacyHeaders: true,
    standardHeaders: true,
});

app.use('/api' , limiter);

app.get('/health' , (req, res) => {
    res.status(200).send({
        success: true,
        message: 'Server is running',
        timestamp: new Date(),
    });
});

app.use('/api/employee' , employeeRoutes);

app.use(notFoundHandler)

app.use(handleError);

const startServer = async () => {
    try{
        await connectDB();
        app.listen(port, () => {
            logger.info('Server is running on port', port);

        });


    }catch(error){
        logger.error(`failed to start server on port: ${error.message}`);
        process.exit(1);
    }
}

startServer();

export default app;
