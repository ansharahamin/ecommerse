import jwt from "jsonwebtoken"
import userModel from '../models/users.models.js'
export async function authenticateToken(req,res,next) {
    const token = req.cookies.token
    if(!token){
      return res.status(401).json({message:'authentication required'})
    }
    try {
        req.user = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(401).json({message:'user not found'})
        }
        req.user.role = user.role
        next()
    } catch (error) {
        return res.status(401).json({message:'invalid or expired session'})
    }
}
export async function requireAdmin(req,res,next){
if (req.user?.role !== 'admin') {
    return res.status(403).json({message:"Forbidden"})
}
next()
}
