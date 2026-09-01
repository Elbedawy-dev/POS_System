import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  FiDollarSign,
  FiUser,
  FiFolder,
  FiCreditCard,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    minStock: 5,
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      setForm({
        name: "",
        category: "",
        purchasePrice: "",
        sellingPrice: "",
        stock: "",
        minStock: 5,
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      minStock: product.minStock || 5,
    });
    setEditingId(product._id);
  };

  if (loading)
    return <div className="p-8 animate-pulse text-lg">Loading....</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-screen mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <FiDollarSign /> Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="number"
          placeholder="Min Stock"
          value={form.minStock}
          onChange={(e) => setForm({ ...form, minStock: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors col-span-full md:col-span-1"
        >
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {/* Products List */}
      <div className="space-y-4">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg flex justify-between items-center"
            >
              {/* Info */}
              <div className="space-y-1">
                <p className="text-lg font-semibold flex items-center gap-2">
                  <FiFolder className="text-green-500" /> {product.name}
                </p>

                <p className="text-gray-600 flex items-center gap-2">
                  <FiUser /> {product.category}
                </p>

                <p className="flex items-center gap-1 text-gray-700">
                  <FiDollarSign /> ${product.sellingPrice}
                </p>

                <p className="text-gray-500">Stock: {product.stock}</p>

                <p
                  className={`font-medium ${product.stock <= (product.minStock || 5) ? "text-red-600" : "text-green-600"}`}
                >
                  Min Stock: {product.minStock || 5}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-yellow-200 rounded hover:bg-yellow-300 transition"
                >
                  <FiEdit />
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2 bg-red-200 rounded hover:bg-red-300 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {products.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center mt-10"
        >
          No products found.
        </motion.p>
      )}
    </div>
  );
};

export default Products;
