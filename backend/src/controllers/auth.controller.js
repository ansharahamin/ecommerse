import userModel from '../models/users.models.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
async function registerUser(req,res){
    try {
        const {userName,email,password} = req.body
        if (!userName || !email || !password) {
            return res.status(400).json({message:'userName, email, and password are required'})
        }
        const userAlreadyExists = await userModel.findOne({
            $or:[
                {userName},
                {email}
            ]
        })
        if(userAlreadyExists){
            return res.status(409).json({message:'user is already exists'})
        }
        const hash = await bcrypt.hash(password,10)
        const user = await userModel.create({userName,email,password:hash,role:'user'})
        const token = jwt.sign({id:user._id,  role: user.role},process.env.JWT_SECRET,{ expiresIn: "1d" })
        res.cookie('token',token,{ httpOnly: true })
        res.status(201).json({
    message: "User created successfully",
    user: { id: user._id, userName: user.userName, email: user.email, role: user.role }
})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'internal server error',
            error : error.message
        })
    }
}
async function loginUser(req,res){
    try {
        const {userName,email,password} = req.body
        if ((!userName && !email) || !password) {
            return res.status(400).json({message:'email or userName and password are required'})
        }
        const user = await userModel.findOne({
            $or:[
                {userName: userName || email},
                {email: email || userName}
            ]
        })
        if (!user || !(await bcrypt.compare(password,user.password))) {
            return res.status(401).json({message:'invalid email, user name, or password'})
        }
        const token = jwt.sign({
            id:user._id,
            role:user.role,
        },process.env.JWT_SECRET,{expiresIn :'1d'})
        res.cookie('token',token,{httpOnly:true,sameSite:'lax'})
        res.status(200).json({
            message:'User logged in successfully',
            user: { id: user._id, userName: user.userName, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json({message:'internal server error',error:error.message})
    }
}
export {registerUser,loginUser}
