import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, AlertCircle } from "lucide-react";

const CreateProduct = () => {
const [name, setName] = useState("")
const [category, setCategory] = useState("")
const [purchasePrice, setPurchasePrice] = useState("")
const [sellingPrice, setSellingPrice] = useState("")
const [stock, setStock] = useState("")
const [minStock, setMinStock] = useState(5)
const [loading, setLoading] = useState(false)
const [error, setError] = useState("")
const nav = useNavigate()

const submit = async(e) => {

    e.preventDefault()
    setError("")
    setLoading (true)

    try {
        await api.post("/products", {
            name,
            category,
            purchasePrice:parseFloat(purchasePrice),
            sellingPrice:parseFloat(sellingPrice),
            stock: parseInt(stock),
            minStock:parseInt(minStock) || 5,
        })
        setLoading (false);
        nav("/products");
    } catch(error) {
        setError(error.response?.data?.message || "Error")                           
        setLoading(false) 
    }
}

  return (
<div className="pt-32 min-h-screen p-10 bg-linear-to-b
 from-[#faf6ef] to-[#f0e5d2] flex justify-center">

<motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
    className="w-full max-w-lg p-8 bg-white/90 backdrop-blur-xl border
    border-[#C9A86A]/25 rounded-2xl shadow-xl flex flex-col gap-6">
<h1 className="text-3xl font-bold text-yellow-600 flex items-center gap-3">
    <Package size={36} className="text-[#C9A86A]"/> Add New Product</h1>

{error && (
    <div className="flex items-center gap-2 p-3 bg-red-100 border
    border-red-300 text-red-700 rounded-md">
    <AlertCircle size={20} /> {error}
    </div>
)}

    <form onSubmit={submit} className="flex flex-col gap-4">
        <input type="text" placeholder="Product Name"
            value={name} onChange={(e) => setName(e.target.value)}
            className="p-3 border border-neutral-300 rounded-xl focus:outline-none
            focus:ring-2 focus:ring-yellow-400" required/>

        <input type="text" placeholder="Category"
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-neutral-300 rounded-xl focus:outline-none
            focus:ring-2 focus:ring-yellow-400" required/>

        <input type="number" placeholder="Purchase Price"
            value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)}
            className="p-3 border border-neutral-300 rounded-xl focus:outline-none
            focus:ring-2 focus:ring-yellow-400" required/>

        <input type="number" placeholder="Selling Price"
            value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)}
            className="p-3 border border-neutral-300 rounded-xl focus:outline-none
            focus:ring-2 focus:ring-yellow-400" required />

        <input type="number" placeholder="Stock"
            value={stock} onChange={(e) => setStock(e.target.value)}
            className="p-3 border border-neutral-300 rounded-xl focus:outline-none
            focus:ring-2 focus:ring-yellow-400" required/>

        <input type="number" placeholder="Min Stock"
            value={minStock} onChange={(e) => setMinStock(e.target.value)}
            className="p-3 border border-neutral-300 rounded-xl focus:outline-none
            focus:ring-2 focus:ring-yellow-400" required/>

            <button type = "submit" disabled = {loading} className="mt-4 py-3 bg-linear-to-r 
            from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg
              hover:shadow-yellow-300/40 transition-all cursor-pointer">
                {loading ? "Saving...": "Save Product"}
            </button>
        </form>
        </motion.div>

</div>
  )
}

export default CreateProduct;