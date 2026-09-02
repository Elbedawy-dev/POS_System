import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiPlusCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/products", {
        name,
        category,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        stock: parseInt(stock),
        minStock: parseInt(minStock) || 5,
      });
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] p-6">
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-[#C9A86A]/30"
      >
        <div className="flex justify-center mb-5">
          <FiPackage size={42} className="text-[#C9A86A]" />
        </div>
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-8">
          Create Product
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label className="text-neutral-700 font-medium">Product Name</label>
            <input
              type="text"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Category</label>
            <input
              type="text"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Purchase Price</label>
            <input
              type="number"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter purchase price"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Selling Price</label>
            <input
              type="number"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter selling price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Stock</label>
            <input
              type="number"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter stock quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Min Stock</label>
            <input
              type="number"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Minimum stock level"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C9A86A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FiPlusCircle size={20} />
            {loading ? "Saving..." : "Add Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProduct;