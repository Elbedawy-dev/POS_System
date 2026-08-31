import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminAuthContext from "../Context/AdminAuthContext";
import { FiUserPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminRegister = () => {
  const { register, error } = useContext(AdminAuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

return (
  <div className="pt-32 min-h-screen flex items-center justify-center 
        bg-linear-to-b from-[#f0e5d2] to-[#e2d1b8] p-6">
    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} className="w-full max-w-md bg-white/90 
      backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-[#C9A86A]/30">

      <div className="flex items-center justify-center mb-6">
          <FiUserPlus size={40} className="text-[#C9A86A]" />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
        Create Admin Account
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} 
            className="p-3 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] 
            focus:ring-1 focus:ring-[#C9A86A] transition-all outline-none"/>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} 
            className="p-3 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] 
            focus:ring-1 focus:ring-[#C9A86A] transition-all outline-none"/>

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} 
            className="p-3 rounded-xl border border-[#C9A86A]/25 focus:border-[#C9A86A] 
            focus:ring-1 focus:ring-[#C9A86A] transition-all outline-none"/>

        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-3 
        rounded-xl border border-[#C9A86A]/25  focus:border-[#C9A86A]  
            focus:ring-1 focus:ring-[#C9A86A]  transition-all outline-none bg-white">
          <option value="admin">Admin</option>
          <option value="super-admin">Super Admin</option>
        </select>

        {error && <div className="text-red-500 font-medium text-center">{error}</div>}

        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
            className="bg-[#C9A86A] text-white font-semibold py-3 rounded-xl shadow-lg 
            hover:shadow-2xl transition-all">
          Register
        </motion.button>
      </form>
    </motion.div>
  </div>
);
};

export default AdminRegister;