import express from "express"

import {
    dailyReport,
    rangeReport,
    topProducts,
    weeklyReport
} from "../controllers/reportsController.js"

import {protect , authorize} from "../middlewares/auth.js"

const router = express.Router()

router.post("/daily" , protect , authorize("manager", "admin", "cashier"), dailyReport)
router.post("/range" , protect , authorize("manager", "admin", "cashier"), rangeReport)
router.get("/top-products" , protect , authorize("manager" , "admin", "cashier"), topProducts)
router.get("/weekly" , protect , authorize("manager", "admin", "cashier"), weeklyReport)

export default router