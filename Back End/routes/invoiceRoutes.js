import express from "express"
import {
    createInvoice,
    getInvoices,
    getInvoiceById
} from "../controllers/invoiceController.js"

import {protect , authorize} from "../middlewares/auth.js"

const router = express.Router()

router.get("/" , protect , getInvoices)
router.get("/:id" , protect , getInvoiceById)
router.post("/" , protect , authorize("cashier" , "manager" , "admin" , "super-admin" ) , createInvoice)

export default router