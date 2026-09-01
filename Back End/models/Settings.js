import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
     storeName: String,
     taxRate: Number,
     logo: String
}, {timestamps:true})

export default mongoose.model("settings", settingsSchema)