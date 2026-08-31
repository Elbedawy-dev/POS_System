import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {type: Number, required: true, unique:true},

    items: [

        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            name:String,
            qty: Number,
            price: Number,
            total: Number,
        },

    ],
    subTotal:Number,
    discount:Number,
    tax:Number,
    finalTotal:Number,
    paymentMethod: {type: String, enum: ["cash", "visa"], default:"cash"},
    cashier: {type: mongoose.Schema. Types.ObjectId, ref:"User"},
    customer: {type: mongoose. Schema. Types.ObjectId, ref: "Customer", default:null}

}, {timestamps: true}) 

export default mongoose.model("Invoice", invoiceSchema)