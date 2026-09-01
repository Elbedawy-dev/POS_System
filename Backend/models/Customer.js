import mongoose from "mongoose"

const customerSchema = new mongoose.Schema({

    name:String,
    email:String,
    points: {type:Number, default:0},

}, {timestamps: true})

export default mongoose.model( "Customer", customerSchema)