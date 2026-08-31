import mongoose from "mongoose";

const projectSchema = new mongoose.Schema ({

    name: {type: String, required: true},
    discription: String,
    goalAmount: {type: Number, required: true},
    collectedAmount: {type: Number, default:0},
    startDate: {type: Date, default: Date.now},
    endDate: Date,
    status: {type: String, enum: ["active", "completed", "cancelled"], default:"active"}
},  {timestamps:true})

export default mongoose.model("Project", projectSchema)