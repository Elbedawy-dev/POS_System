import Admin from "../models/Admin.js";
import { sendAdminToken } from "../utils/generateAdminToken.js";

export const adminRegister = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        if (await Admin.findOne({ email })) {
            return res.status(400).json({ message: "Email exists" });
        }

        const admin = new Admin({ name, email, password, role });
        await admin.save();

        return sendAdminToken(admin, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        return sendAdminToken(admin, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const adminLogout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("admin_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.json({ success: true, message: "Logged out successfully" });
};

export const getAdminProfile = (req, res) => {
    res.json(req.admin);
};