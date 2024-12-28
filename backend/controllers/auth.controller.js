
import {User} from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { useId } from "react";
export async function signin(req, res) {
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid Email" });
      }
  
      if (password.length < 6) { // Corrected 'lenght' to 'length'
        return res.status(400).json({ success: false, message: "Password must be six characters" });
      }
  
      const exisitingUserByemail = await User.findOne({ email: email });
  
      if (exisitingUserByemail) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
  
      const exisitingUserByuser = await User.findOne({ username: username });
      if (exisitingUserByuser) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }


      const salt =await bcryptjs.genSalt(10);
      const hashedPassword=await bcryptjs.hash(password,salt)
  
      const PROFILE_PICS = [""]; // No change to empty array if intentional
      const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
  
      const newUser = new User({
        email,
        password:hashedPassword,
        username,
        image,
      });

     if (newUser){
        generateTokenAndSetCookie(newUser.useId,res)
        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully", user:{
            ...newUser._doc,
            password:""
          }});
      
     }

      
  
     
       
    } catch (error) {
      console.log("Error in signup Controller", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
export async function login(req,res) {
    try {
        const {email,password}=req.body;
        if (!email||!password){
            return res.status(400).json({success:false,message:"All fields Required"});

        }
        const user=await User.findOne({email:email})
        if (!user){
            return  res.status(400).json({success:false,message:"invalid credentials"})
        }
        
        const isPasswordcorrect =await bcryptjs.compare(password,user.password)
        if (!isPasswordcorrect){
            return  res.status(400).json({success:false,message:"invalid credentials"})

        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            success:true,
            user:{...user._doc,password:""}
        })

    } catch (error) {

        console.log("error in login controller",error.message)
        res.status(500).json({success:false,message:"internal server Error"})
        
    }
    
}

export async function logout(req,res) {
   try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({success:true,message:"logged out successfully"})
    
   } catch (error) {
    console.log("error in logout controller",error.message)

    res.status(500).json({success:false,message:"internal server Error"})
    
   }
}
