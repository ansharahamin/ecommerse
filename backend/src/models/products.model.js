import mongoose from 'mongoose'
const productsSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    des:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['Home','Lifestyle','Accessories'],
        default:'Home'
    },
    price:{
        type:Number,
        required:true,
        min:0.01
    },
    currency:{
        type:String,
        required:true,
        enum:['PKR'],
        default:'PKR'
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
})
const productModel = mongoose.model('product',productsSchema)
export default productModel