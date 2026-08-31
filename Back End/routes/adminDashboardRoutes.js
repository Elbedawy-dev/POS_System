import express from "express"
import {getDashboardStats} from "../controllers/adminDashboardController.js"
import {protectAdmin , authorizeAdmin} from "../middlewares/adminAuth.js"

const router = express.Router()

router.get("/" , protectAdmin , authorizeAdmin("admin" , "super-admin") , getDashboardStats)

export default router