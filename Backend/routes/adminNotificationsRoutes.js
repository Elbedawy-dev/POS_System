import express from "express"

import {getAdminNotifications,markAdminNotificationSeen,createAdminNotification}
from "../controllers/adminNotificationsController.js"

import {protectAdmin , authorizeAdmin} from "../middlewares/adminAuth.js"
const router = express.Router()


router.use(protectAdmin,authorizeAdmin("admin" , "super-admin"))

router.get("/" , getAdminNotifications)
router.post("/", createAdminNotification)
router.put("/:id" , markAdminNotificationSeen)

export default router