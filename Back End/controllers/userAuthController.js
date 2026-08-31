import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

const createToken = (res, userId) => {
const token = jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn: "7d"})

res.cookie("token", token, {
    httpOnly:true, 
    secure: false, 
    sameSite:"strict", 
    maxAge: 7* 24* 60* 60* 1000,
}) 
    return token
}

export const registerUser = async(req, res) =>{

const {name, email, password} = req.body

    try {
        const existing = await User.findOne({email})
        if(existing) { 
            return res.status(400).json({message: "User already exists"})

    }

    const user = await User.create({name, email, password})
        createToken (res, user._id)
        res.status(201).json({user:{id:user._id, name:user.name, email:user.email}})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const loginUser = async(req, res) => {
    const {email , password} = req.body

    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({message: "user is invalid"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({message: "password is invalid"})            
        }

        createToken(res, user._id)
        res.status(201).json({user:{id:user._id, name:user.name, email:user.email}})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const logoutUser = (req, res) => {
    res.clearCookie("token")
    res.status(200).json({message: "Logout is successfully"})
}

export const getMe = async(req, res) => {
    const user = await User.findById(req.user.id).select("-password")
    res.status(200).json(user)
}