import express from "express"

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js"

import {protect , authorize} from "../middlewares/auth.js"

const router = express.Router()
router.post("/" , protect , authorize("admin" , "manager") , createProduct)
router.get("/" , protect , getProducts)

router.put("/:id" , protect , authorize("admin" , "manager") , updateProduct)

router.delete("/:id" , protect , authorize("admin" ) , deleteProduct)

export default router