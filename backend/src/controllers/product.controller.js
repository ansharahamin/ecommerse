import userModel from "../models/users.models.js";
import productModel from "../models/products.model.js";
import uploadFile from '../../services/storage.service.js'

const allowedCategories = ['Home','Lifestyle','Accessories']

function validateProductFields({name,des,price,category}) {
    const parsedPrice = Number(price)
    if (!name?.trim() || !des?.trim()) {
        return {error:'name and description are required'}
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0.01) {
        return {error:'price must be a positive number'}
    }
    if (!allowedCategories.includes(category || 'Home')) {
        return {error:'category must be Home, Lifestyle, or Accessories'}
    }
    return {
        values: {
            name:name.trim(),
            des:des.trim(),
            price:Math.round(parsedPrice * 100) / 100,
            category:category || 'Home',
        },
    }
}

async function createProducts(req,res){
    try {
        if (!req.file) {
            return res.status(400).json({message:'image is required'})
        }
        const validation = validateProductFields(req.body)
        if (validation.error) {
            return res.status(400).json({message:validation.error})
        }
        const uploadImage = await uploadFile(req.file.buffer,req.file.originalname)
        const product = await productModel.create({
            ...validation.values,
            image:uploadImage.url,
            currency:'PKR',
            admin:req.user.id
        })
        return res.status(201).json({message:'product added',product})
    } catch (error) {
        return res.status(500).json({message:'failed to add product',error:error.message})
    }
}

async function getProducts(req,res){
    try {
        const products = await productModel.find().populate("admin","userName email")
        return res.status(200).json({message:"data is fetched successfully",products})
    } catch (error) {
        return res.status(500).json({message:'failed to fetch products',error:error.message})
    }
}

async function getMyProducts(req,res){
    try {
        const products = await productModel.find({admin:req.user.id}).sort({_id:-1})
        return res.status(200).json({products})
    } catch (error) {
        return res.status(500).json({message:'failed to fetch your products',error:error.message})
    }
}

async function updateProduct(req,res){
    try {
        const validation = validateProductFields(req.body)
        if (validation.error) {
            return res.status(400).json({message:validation.error})
        }
        const product = await productModel.findOne({_id:req.params.id,admin:req.user.id})
        if (!product) {
            return res.status(404).json({message:'product not found'})
        }
        let image = product.image
        if (req.file) {
            const uploadImage = await uploadFile(req.file.buffer,req.file.originalname)
            image = uploadImage.url
        }
        Object.assign(product,validation.values,{image})
        await product.save()
        return res.status(200).json({message:'product updated',product})
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message:'invalid product id'})
        }
        return res.status(500).json({message:'failed to update product',error:error.message})
    }
}

async function deleteProduct(req,res){
    try {
        const product = await productModel.findOneAndDelete({_id:req.params.id,admin:req.user.id})
        if (!product) {
            return res.status(404).json({message:'product not found'})
        }
        return res.status(200).json({message:'product deleted'})
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({message:'invalid product id'})
        }
        return res.status(500).json({message:'failed to delete product',error:error.message})
    }
}

export {createProducts,getProducts,getMyProducts,updateProduct,deleteProduct}