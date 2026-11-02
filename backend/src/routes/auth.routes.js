import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.controller.js'
const router = express.Router()
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',(req,res) => {
    res.clearCookie('token',{httpOnly:true,sameSite:'lax'})
    res.status(200).json({message:'User logged out successfully'})
})
export default router