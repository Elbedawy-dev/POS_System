import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Users, Mail, Search } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/customers")
      .then((res) => {
        setCustomers(res.data || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filtered = customers.filter((c) => {
    const nameMatch = (c.name || "").toLowerCase().includes(search.toLowerCase());
    const emailMatch = (c.email || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pt-32 p-8 bg-[#f6f4ef] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-[#C9A86A]/20 rounded-xl border border-[#C9A86A]/30 backdrop-blur-md">
          <Users size={28} className="text-[#C9A86A]" />
        </div>

        <h1 className="text-4xl font-semibold text-neutral-900 tracking-wide">
          Customers
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative max-w-md mb-10"
      >
        <Search size={20} className="absolute left-3 top-3 text-neutral-400" />

        <input
          type="text"
          placeholder="Search Customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-300 bg-white shadow-sm outline-none focus:border-[#C9A86A] transition"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-600 text-lg">
            No Customers
          </motion.p>
        ) : (
          filtered.map((c) => (
            <motion.div
              key={c._id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#C9A86A]/10 border border-[#C9A86A]/30 rounded-xl group-hover:bg-[#C9A86A] transition">
                  <Users size={22} className="text-[#C9A86A]" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-800 tracking-wide">
                  {c.name}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-neutral-600">
                <Mail size={18} className="text-[#C9A86A]" />
                <span>{c.email}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Customers;