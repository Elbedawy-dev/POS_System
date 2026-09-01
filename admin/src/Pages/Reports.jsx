import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { FiBarChart2, FiTrendingUp, FiFileText } from "react-icons/fi";

const Reports = () => {

  const [daily, setDaily] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [dailyRes, topRes] = await Promise.all([
          api.post("/reports/daily"),
          api.get("/reports/top-products"),
        ]);
        setDaily(dailyRes.data);
        setTopProducts(topRes.data);
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading)
    return <div className="p-6 animate-pulse text-lg"> Loading...</div>

return (
  <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 min-h-screen mx-auto">

    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-8">
      <FiBarChart2 className="text-3xl text-blue-600" />
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
    </motion.div>

    {/* Daily Summary */}
    {daily && (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-md border hover:shadow-xl transition">
          <div className="flex items-center gap-3 mb-3">
            <FiTrendingUp className="text-green-600 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Sales</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800">{daily.totalSales} USD</p>
          <p className="text-gray-500 mt-1">Invoices: {daily.count}</p>
        </div>
      </motion.div>
    )}

    {/* Top Products */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiFileText /> Top 10 Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topProducts.map((p, index) => (
          <motion.div key={index}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition">
            <p className="font-semibold text-gray-900">#{index + 1} {p._id}</p>
            <p className="text-gray-500 text-sm mt-1">Sold: {p.sold} units</p>
          </motion.div>
        ))}
      </div>

      {topProducts.length === 0 && (
        <p className="mt-10 text-gray-500 text-center">No report data available.</p>
      )}
    </motion.div>

  </div>
)
};

export default Reports;