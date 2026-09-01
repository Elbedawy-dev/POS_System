import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import {Lock , User} from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  }; 

  return (
    <div className="p-6 pt-25 pb-25 min-h-screen flex bg-linear-to-b from-[#faf6ef]
    to-[#f0e5d2] items-center justify-center">
      
    <motion.div initial={{ opacity: 0 , y: 30}} animate={{ opacity: 1 , y: 0}}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl
        border border-[#C9A86A]/30 rounded-3xl shadow-2xl p-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-2xl bg-[#C9A86A]/20
           border border-[#C9A86A]/30 mb-3">
           <Lock size={36} className="text-[#C9A86A]" />
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">Login to your account</h1>
          <p className="text-neutral-600 mt-2 text-center">Enter your email and password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <motion.div initial={{ opacity: 0 , x: -20}} animate={{ opacity: 1 , x: 0}}
          transition={{delay: 0.1}}>

            <label className="text-neutral-800 font-medium">Email</label> 
            <div className="flex items-center border border-neutral-300 rounded-xl p-2
            bg-white shadow-sm focus-within:border-[#C9A86A] transition">
              <User size={20} className="text-[#C9A86A] mr-2" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required className="w-full outline-none p-2 bg-transparent"
              placeholder="Enter your email"/>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 , x: -20}} animate={{ opacity: 1 , x: 0}}
            transition={{delay: 0.1}}>
              
            <label className="text-neutral-800 font-medium">Password</label> 
            <div className="flex items-center border border-neutral-300 rounded-xl p-2
            bg-white shadow-sm focus-within:border-[#C9A86A] transition">
              <Lock size={20} className="text-[#C9A86A] mr-2" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required className="w-full outline-none p-2 bg-transparent"
              placeholder="Enter your password"/>
            </div>
          </motion.div> 

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-500 text-sm">
              {error }
            </motion.p>
          )}

          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} type="submit"
            className="mt-4 py-3 bg-[#C9A86A] text-white font-semibold
            rounded-xl shadow-lg  hover:bg-[#b8965f] transition text-lg">
              Login
            </motion.button>

        </form>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0}}
          className="mt-8 text-center text-neutral-600 text-sm">
          &copy; 2026 POS System
        </motion.div>

      </motion.div>
    </div>
  ) 
};

export default Login;