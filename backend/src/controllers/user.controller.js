import {User} from '../models/user.model.js';
import httpStatus from 'http-status';
import bcrypt,{hash} from 'bcrypt';

const login=async(req,res)=>{
    const{username,password}=req.body;
    if(!username || !password){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Please provide all the details"});
    }
    try{
        const user=await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
        }
        if(bcrypt.compare(password,user.password)){
            let token=crypto.randomBytes(64).toString('hex');
            user.token=token;
            await user.save();
            return res.status(httpStatus.OK).json({message:"Login successful",token:token});
        }
    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Something went wrong"});
    }
};
const register=async(req,res)=>{
    const{name,username,password}=req.body;
    try{
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User already exists"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name:name,
            username:username,
            password:hashPassword
        });
        await newUser.save();
        return res.status(httpStatus.CREATED).json({message:"User registered successfully"
        })

    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Something went wrong"});

    }
};
export {login};
export {register};
