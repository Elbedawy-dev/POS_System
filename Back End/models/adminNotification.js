import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema({
    message: String,
    type: {
        type: String,
        enum: ["info", "transaction", "project"],
        default: "info"
    },
    seen: { type: Boolean, default: false }
}, {timestamps: true})

export default mongoose.model("adminNotification", adminNotificationSchema)