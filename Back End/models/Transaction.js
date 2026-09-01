import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId, ref:"Project", required: true
    },

    amount: {
        type: Number, required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId, ref:"User"
    },

    status: {
        type: String, enum: ["pending", "completed", "failed"], default: "pending"
    },

    paymentMethod: {
         type: String, enum: ["cash", "visa"], default: "cash"
    }, 
    
}, {timestamps: true})

export default mongoose.model("transaction", transactionSchema)