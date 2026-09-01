import express from "express"

import {
    dailyReport,
    rangeReport,
    topProducts,
    weeklyReport
} from "../controllers/reportsController.js"

import {protect , authorize} from "../middlewares/auth.js"

const router = express.Router()

router.post("/daily" , protect , authorize("manager" , "admin"), dailyReport)
router.post("/range" , protect , authorize("manager" , "admin"), rangeReport)
router.get("/top-products" , protect , authorize("manager" , "admin"), topProducts)
router.get("/weekly" , protect , authorize("manager" , "admin"), weeklyReport)

export default router