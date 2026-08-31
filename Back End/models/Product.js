import mongoose from "mongoose"

const productSchema = new mongoose. Schema ({

    name: {type: String, required:true},
    category: {type: String, required: true},
    purchasePrice: {type: Number, required:true},
    sellingPrice: {type: Number, required:true},
    stock: {type:Number, required:true},
    minStock: {type: Number, default:5},

},  {timestamps: true})

export default mongoose.model( "Product", productSchema)