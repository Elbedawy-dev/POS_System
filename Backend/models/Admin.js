import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true        
    },

    password: {
        type: String,
        required: true   
    },

    role:{
        type: String,
        enum: ["admin", "super-admin"],
        default: "admin"
    }
}, {timestamps: true})

adminSchema.methods.comparePassword = async function (pass) {
    return await bcrypt.compare(pass, this.password);
};

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Admin", adminSchema);