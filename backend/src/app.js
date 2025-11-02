import express from 'express';
import {createServer} from 'node:http';
import {Server} from "socket.io";
import cors from 'cors';
import userRoutes from './routes/users.routes.js';
import mongoose from 'mongoose';
import { connectToSocket } from './controllers/socketManager.js';

import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const app = express();
const server=createServer(app);
const io= connectToSocket(server);

app.set("port",(process.env.PORT || 5000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended:true}));

app.use("/api/v1/users",userRoutes);

app.get('/home', (req, res) => {  
    return res.json({"hello": "world"});
});
const start=async()=>{
    app.set("mongo-user")
const connectionDb=await mongoose.connect("mongodb+srv://ghanghavjan_db_user:3nyLaz9FwcHirRny@cluster0.fixmbj.mongodb.net/?appName=Cluster0")
    console.log(`MONGO DB CONNECTED: ${connectionDb.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log(`Server started at port ${app.get("port")}`);
    });
};
start();