import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { FiBell, FiPackage, FiUser, FiFileText, FiShoppingCart, FiBarChart } from "react-icons/fi";

import AdminAuthContext from "../Context/AdminAuthContext";

const Header = () => { 
  const location = useLocation();
  const { admin, logout } = useContext(AdminAuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <FiBarChart /> },
  { name: "Transactions", path: "/transactions", icon: <FiPackage /> },
  { name: "Invoices", path: "/invoices", icon: <FiFileText /> },
  { name: "Customers", path: "/customers", icon: <FiUser /> },
  { name: "Reports", path: "/reports", icon: <FiFileText /> },
  { name: "Notifications", path: "/notifications", icon: <FiBell /> },
];
  return (
   <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}
    transition={{duration: 0.5}} className="fixed top-0 left-0 w-full z-50
    backdrop-blur-xl bg-[#f8f6f1]  border-b border-neutral-300 shadow-md">

    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
      className="flex items-center gap-2 font-bold text-xl text-neutral-900">

      <FiSend className="w-6 h-6 text-yellow-500" />
      <span>Admin Panel</span>
      </motion.div>
      
    {/* Desktop Menu */}

    <div className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <motion.div key={link.path} whileHover={{ scale: 1.1 }}>
          <Link to={link.path} className={`relative text-sm 
            font-medium transition-all duration-300
            ${location.pathname === link.path ? 
            "text-yellow-500" : "text-neutral-700 hover:text-yellow-500"}`}>
            {link.name}

            {location.pathname === link.path && (
              <motion.span layoutId="underline" className="absolute left-0
               -bottom-1 w-full h-0.5 bg-yellow-400 rounded-full" />
            )}
          </Link>

        </motion.div>
      ))}
    
    {admin ? (
      <div className="flex items-center gap-4">
        {/* Notifiction Icon */}
        <Link to="/notifications">
          <motion.div whileHover={{ scale: 1.2, rotate: 10}} className="relative
            cursor-pointer">
            <FiBell size={22} className="text-yellow-500" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500
            rounded-full animate-pulse"/>
          </motion.div>
        </Link>

        {/* Profile Icon */}
        <Link to="/profile">
          <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
            <FiUser size={22} className="text-yellow-500" />
          </motion.div>
        </Link>

        {/* Logout Button */}

        <button onClick={() => { logout();  
        }}
          className="ml-2 bg-linear-to-r from-yellow-400
          to-orange-500 px-4 py-1.5 rounded-full font-medium text-white
          hover:shadow-lg hover:shadow-yellow-300/40 transition-all">
            logout
      </button>
      </div>
    ) : (
      <div className="flex items-center gap-4">
        <Link to="/adminlogin" className="text-neutral-700 hover:text-yellow-500 
        transition-all font-medium">  
          Login
        </Link>
        <Link to="/adminregister" className="bg-linear-to-r from-yellow-400
         to-orange-500 px-4 py-1.5 rounded-full font-medium text-white
           hover:shadow-lg hover:shadow-yellow-300/40 transition-all">
          Register
        </Link>
      </div>
    )}
    </div>

    {/* Mobile Menu */} 

    <div className="md:hidden flex items-center gap-3">
        <button onClick={() => setIsMobileMenuOpen((prev) => !prev)}
         className="text-neutral-900 text-2xl focus:outline-none">
       {isMobileMenuOpen ? <HiX /> : <HiMenu />}
         </button>
    </div>
    </div>

    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}}
        exit={{height: 0, opacity: 0}} transition={{duration: 0.3}} 
        className="md:hidden bg-[#f8f6f1] border-t border-neutral-300 overflow-hidden">

        <div className="flex flex-col px-6 py-4 gap-4 text-neutral-900">
        {navLinks.map((link) => {
          return (
            <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-medium transition-all duration-300 hover:text-yellow-500
              ${location.pathname === link.path ? "text-yellow-500" : "text-neutral-700"}`}>
              {link.name}
            </Link>
          );
        })}
           
           {admin ? (

            <div className="flex items-center gap-4 mt-2">
              <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiBell size={22} className="text-yellow-500" />
              </Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiUser size={22} className="text-yellow-500" />
              </Link>

              <button onClick={() => {
                logout()
                setIsMobileMenuOpen(false);
              }} className = "bg-linear-to-r from-yellow-400
               to-orange-500 px-4 py-1.5 rounded-full font-medium
               text-white hover:shadow-lg hover:shadow-yellow-300/40 transition-all">
                logout
              </button>
            </div>
           ) : (

            <div className="flex flex-col gap-2 mt-2">
              <Link to="/adminlogin" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-700
               hover:text-yellow-500 transitian-all font-medium">  
                  Login
              </Link>
              <Link to="/adminregister" onClick={() => setIsMobileMenuOpen(false)} className="bg-linear-to-r
               from-yellow-400 to-orange-500 px-4 py-1.5 rounded-full font-medium text-white
                hover:shadow-lg hover:shadow-yellow-300/40 transition-all">
                  Register
              </Link>
            </div>
           )}

        </div>
        </motion.div>
      )}

    </AnimatePresence>
   </motion.div>
  )
};

export default Header;