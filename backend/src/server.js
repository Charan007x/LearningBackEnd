import express from 'express';
import env from 'dotenv';
import {connectDB} from './config/db.js';
env.config();
connectDB();
const app=express();
const port =process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);  
});