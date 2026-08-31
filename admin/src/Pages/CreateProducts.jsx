import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiPlusCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const navigate = useNavigate(); 
  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", { name, price, qty });
      navigate("/products");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] p-6">
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
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label className="text-neutral-700 font-medium">Product Name</label>
            <input
              type="text"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Price</label>
            <input
              type="number"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="text-neutral-700 font-medium">Quantity</label>
            <input
              type="number"
              className="w-full p-3 mt-1 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] focus:ring-[#C9A86A] focus:ring-1 transition-all outline-none"
              placeholder="Enter quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#C9A86A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <FiPlusCircle size={20} />
            Add Product
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProduct;