import express from 'express'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { addToCart, getCart } from '../controllers/cart.controller.js'
const router = express.Router()

router.post('/items',authenticateToken,addToCart)
router.get('/',authenticateToken,getCart)
export default router