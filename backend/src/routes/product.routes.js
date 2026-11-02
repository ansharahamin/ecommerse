import express from 'express'
import { createProducts, deleteProduct, getMyProducts, getProducts, updateProduct } from '../controllers/product.controller.js'
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.middleware.js'
const router = express.Router()
router.post('/createProduct',authenticateToken,requireAdmin,upload.single('image'),createProducts)
router.get('/mine',authenticateToken,requireAdmin,getMyProducts)
router.put('/:id',authenticateToken,requireAdmin,upload.single('image'),updateProduct)
router.delete('/:id',authenticateToken,requireAdmin,deleteProduct)
router.get('/',getProducts)
export default router