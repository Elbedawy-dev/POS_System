import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try{
        const product = await Product.create(req.body)
        res.json(product)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}


export const getProducts = async (req, res) => {
    const products = await Product.find()
    res.json(products)
}


export const updateProduct = async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
    })
    res.json(updated)
}

export const deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id)
    res.json({message:"Product deleted"})
}