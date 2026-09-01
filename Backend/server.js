import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/adminAuthRoutes.js";
import adminUsersRoutes from "./routes/adminUsersRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminProjectsRoutes from "./routes/adminProjectsRoutes.js";
import adminTransactionsRoutes from "./routes/adminTransactionsRoutes.js";
import adminNotificationsRoutes from "./routes/adminNotificationsRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";

dotenv.config()

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://pos-system-commercial.vercel.app",
  "https://pos-system-admins.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())


app.get("/" , (req,res)=> res.json({message:"api is running..."}))


app.use("/api/admin/auth" , authRoutes)
app.use("/api/admin/users" , adminUsersRoutes)
app.use("/api/admin/dashboard" , adminDashboardRoutes)
app.use("/api/admin/projects" , adminProjectsRoutes)
app.use("/api/admin/transactions" , adminTransactionsRoutes)
app.use("/api/admin/notifications" , adminNotificationsRoutes)
app.use("/api/admin/settings" , adminSettingsRoutes)

app.use("/api/auth" , userAuthRoutes)
app.use("/api/products" , productRoutes)
app.use("/api/invoices" , invoiceRoutes)
app.use("/api/customers" , customerRoutes)
app.use("/api/reports" , reportsRoutes)
app.use("/api/notifications" , notificationRoutes)
app.use("/api/settings" , settingsRoutes)


app.use((req,res)=> {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(404).json({message:"Route Not Found"})
})


app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).json({message:err.message})
})


const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app