import mongoose from 'mongoose'
import userModel from '../models/users.models.js'
import productModel from '../models/products.model.js'

export async function addToCart(req,res){
try {
    const productId = req.body.productId
const quentity = req.body.quentity === undefined ? 1 : Number(req.body.quentity)
if(!mongoose.Types.ObjectId.isValid(productId)){ //format check
    return res.status(400).json({message:'invalid product id'})
}
if(!Number.isInteger(quentity) || quentity < 1){
    return res.status(400).json({message:'quentity must be a positive integer'})
}
const product = await productModel.findById(productId)  ///product db ma  exist karti ha ya nhi??
if (!product) {
    return res.status(400).json({message:'product not found'})
}
const user = await userModel.findById(req.user.id)  ///user logged in ha ke nhi???
if (!user) {
    return res.status(400).json({message:'user not found'})
}
const cartItem = user.cart.find(item => item.product.toString() === productId)  //cart ma product mojood ha??
if (cartItem) {   //truthy value
    cartItem.quentity += quentity  //db ki quentity ma increment kia variable se
} else {
    user.cart.push({product:productId,quentity:quentity})  //falsy (cart empty to new obj push karo db ma quentity user ki assigned quentity ke barabar kardo)
}
await user.save()
const updatedUser = await userModel.findById(user._id).select('cart').populate('cart.product','name des image price currency')
return res.status(200).json({message:'product added to the cart',cart:updatedUser.cart})
} catch (error) {
    return res.status(500).json({message:'failed to add product to the cart'},
        error = error.message
    )
}
}
export async function getCart(req,res){
    const user = await userModel.findById(req.user.id).select('cart').populate('cart.product','name des image price currency')
    if(!user){
        return res.status(400).json({message:'user not found'})
    }
    return res.status(200).json({cart:user.cart})
}
