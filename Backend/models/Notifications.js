import mongoose from "mongoose"

const notificationsSchema = new mongoose.Schema({

    message:String,
    type: {type: String, enum: ["low_stock", "invoice", "info"]},
    seen: {type: Boolean, default:false},

},  {timestamps:true})

export default mongoose.model("Notification", notificationsSchema)