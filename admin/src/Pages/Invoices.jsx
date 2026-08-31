import React, { useState, useEffect } from "react";
import axios from "../api/axios";

import { FiFileText, FiDollarSign, FiCalendar, FiInfo } from "react-icons/fi";

import { motion } from "framer-motion";

const Invoices = () => {

  const [invoices , setInvoices] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const fetchInvoices = async ()=>{
      try{
        const res = await axios.get("/admin/transactions")
        setInvoices(res.data)
      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }
    fetchInvoices()
  },[])

  if(loading)
    return(
      <div className="p-8 text-xl font-semibold animate-pulse">
        Loading Invoices...
      </div>
    )

  return (
    <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-screen">

      <motion.h2 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FiFileText /> Invoices
      </motion.h2>

      <div className="space-y-4">
        {invoices.map((invoice, index)=>(
          <motion.div key={invoice._id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}}
            transition={{delay:index * 0.06}}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition flex justify-between items-center">

            <div>
              <p className="text-lg font-semibold flex items-center gap-2">
                <FiFileText />
                Invoice #{invoice._id.slice(-6)}
              </p>

              {invoice.data &&(
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FiCalendar />
                  {new Date(invoice.data).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="text-right">

              <p className="text-xl font-bold flex justify-end items-center gap-1">
                <FiDollarSign /> {invoice.totalAmount} USD
              </p>

              <div className="mt-1 text-gray-500 flex justify-end items-center gap-1 text-sm">
                <FiInfo />
                {invoice.status ? invoice.status : "Completed"}
              </div>

            </div>

          </motion.div>
        ))}
      </div>

      {invoices.length === 0 &&(
        <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-gray-500 text-center mt-10">
          No Invoices available.
        </motion.p>
      )}

    </div>
  )
};

export default Invoices;