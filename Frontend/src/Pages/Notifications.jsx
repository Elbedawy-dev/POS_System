import { useState, useEffect } from  "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

useEffect(() => {
   api.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(error =>  console.error('Error fetching notifications:', error))
}, []);

  return (
    <div className="pt-32 min-h-screen p-10 bg-linear-to-b from-[#faf6ef] to-[#f0e5d2]">

<motion.div initial={{ opacity: 0 , y: -25}} animate={{ opacity: 1 , y: 0}}
        className="flex items-center gap-4 mb-10">
    <div className="p-3 rounded-xl bg-[#C9A86A]/20 border border-[#C9A86A]/30">
        <Bell size={32} className="text-[#C9A86A] " />
    </div>  

    <h1 className="text-4xl font-bold text-neutral-900 tracking-wide">
        Notifications
    </h1>
</motion.div> 

<div className="flex flex-col gap-6 mx-auto">
<AnimatePresence>
    {notifications.length === 0 ? (
        <motion.p initial ={{opacity: 0}} animate={{opacity: 1}}
        className="text-left text-neutral-600 text-lg">
            No Notifications
        </motion.p>
    ) : (
        notifications.map((n ) => (
          <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)" }}
            transition = {{type: "spring", stiffness: 200, damping: 20 }}           
            className="rounded-2xl shadow-md cursor-pointer transition-all">
              <p className="text-neutral-800 font-medium">
                  {n.message}
              </p>
 
              <span className="text-neutral-500 text-sm mt-1 block">
                  {new Date(n.createdAt).toLocaleString()}
              </span>
          </motion.div>
        ))
    )}
    </AnimatePresence>  

    </div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="mt-16 text-center text-neutral-600">
        <p>End of notifications timeline</p>
    </motion.div>
</div>
  )
}; 

export default Notifications;