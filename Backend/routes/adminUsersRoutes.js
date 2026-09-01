import express from "express"

import {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    createAdmin
} from "../controllers/adminUsersController.js"
import {protectAdmin , authorizeAdmin} from "../middlewares/adminAuth.js"
const router = express.Router()


router.use(protectAdmin,authorizeAdmin("admin" , "super-admin"))

router.get("/" , getAllAdmins)
router.get("/:id" , getAdminById)
router.put("/:id" , updateAdmin)
router.delete("/:id" , deleteAdmin)
router.post("/" , createAdmin)

export default router