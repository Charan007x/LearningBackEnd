import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser=async(req,res)=>{
    const {username,password}=req.body;
    try{
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message:'Username already exists'});
        }else{
            const hashedPassword=await bcrypt.hash(password,10);
            const newUser=new User({username,password:hashedPassword});
            await newUser.save();
            res.status(201).json({message:'User registered successfully'});
        }
    }catch(err){
        console.error('Error registering user:',err);
        res.status(500).json({message:'Server error'});
    }
};

export const loginUser=async(req,res)=>{
    const {username,password}=req.body;
    try{
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({message:'Invalid username or password'});
        }else{
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:'Invalid username or password'});
            }else{
                const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
                res.json({token, message:`Welcome, ${username}!`});
            }
        }
    }catch(err){
        console.error('Error logging in user:',err);
        res.status(500).json({message:'Server error'});
    }
};

export const getUserProfile=async(req,res)=>{
    const {userName}=req.body;
    try{
        const user=await User.findOne({username:userName});
        if(!userName||!user){
            return res.status(400).json({message:'User doesnot exist'});
        }else{
            res.json({message:'User profile fetched successfully',userName});
        }     
    }catch(err){
        console.error('Error fetching user profile:',err);
        res.status(500).json({message:'Server error'});
    }
};