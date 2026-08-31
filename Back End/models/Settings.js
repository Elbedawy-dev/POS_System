import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
     storeName: String,
     texRate: Number,
     logo: String
}, )

export default mongoose.model("settings", settingsSchema)