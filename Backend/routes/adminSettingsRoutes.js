import express from "express"

import {
    getAdminSettings,
    updateAdminSettings
} from "../controllers/adminSettingsController.js"

import {protectAdmin , authorizeAdmin} from "../middlewares/adminAuth.js"

const router = express.Router()
router.use(protectAdmin , authorizeAdmin("admin" , "super-admin"))

router.get("/" , getAdminSettings)
router.put("/" , updateAdminSettings)

export default router