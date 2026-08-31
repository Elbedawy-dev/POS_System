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
        type: String, enum: ["pending", "completed", "failed"] , defult: "pending"
    },

    PaymentMethod: {
         type: String, enum: ["cash", "visa"] , defult: "cash"
    }, 
    
}, {timestamps: true})

export default mongoose.model("Transaction", transactionSchema)