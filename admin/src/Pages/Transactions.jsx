import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { FiDollarSign, FiUser, FiFolder, FiCreditCard, FiEdit, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    projectId: "",
    userId: "",
    amount: "",
    paymentMethod: "cash",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/admin/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/transactions/${editingId}`, form);
      } else {
        await API.post("/admin/transactions", form);
      }
      setForm({ projectId: "", userId: "", amount: "", paymentMethod: "cash" });
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError("Failed to save transaction");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await API.delete(`/admin/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError("Failed to delete transaction");
    }
  };

  const handleEdit = (tx) => {
    setForm({
      projectId: tx.projectId._id,
      userId: tx.userId._id,
      amount: tx.amount,
      paymentMethod: tx.paymentMethod,
    });
    setEditingId(tx._id);
  };

  if (loading) return <div className="p-8 animate-pulse text-lg">Loading transactions...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-screen mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <FiDollarSign /> Transactions
      </h1>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        <input placeholder="Project ID" value={form.projectId}
          onChange={(e)=> setForm({...form , projectId:e.target.value})}
          className="border p-2 rounded w-full" required/>

        <input placeholder="User ID" value={form.userId}
          onChange={(e)=> setForm({...form , userId:e.target.value})}
          className="border p-2 rounded w-full" required/>

        <input type="number" placeholder="Amount" value={form.userId}
          onChange={(e)=> setForm({...form , amount:e.target.value})}
          className="border p-2 rounded w-full" required/>

        <select value={form.paymentMethod}
          onChange={(e)=> setForm({...form , paymentMethod:e.target.value})}
        >

          <option value="cash">Cash

          </option>

          <option value="card">Card

          </option>

          <option value="online">Online

          </option>

        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors col-span-full md:col-span-1">
          {editingId ? "Update" : "Create"}
        </button>

      </form>

      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {transactions.map((tx, index) => (
            <motion.div
              key={tx._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg flex justify-between items-center"
            >
              {/* Info */}
              <div className="space-y-1">
                <p className="text-lg font-semibold flex items-center gap-2">
                  <FiFolder className="text-green-500" /> {tx.projectId.name}
                </p>

                <p className="text-gray-600 flex items-center gap-2">
                  <FiUser /> {tx.userId.name} ({tx.userId.email})
                </p>

                <p className="flex items-center gap-1 text-gray-700">
                  <FiDollarSign /> {tx.amount} USD
                </p>

                <p className="text-gray-500">{tx.paymentMethod}</p>

                <p className={`font-medium ${tx.status === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                  Status: {tx.status}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tx)}
                  className="p-2 bg-yellow-200 rounded hover:bg-yellow-300 transition"
                >
                  <FiEdit />
                </button>

                <button
                  onClick={() => handleDelete(tx._id)}
                  className="p-2 bg-red-200 rounded hover:bg-red-300 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {transactions.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center mt-10"
        >
          No transactions found.
        </motion.p>
      )}

    </div>
  );
}