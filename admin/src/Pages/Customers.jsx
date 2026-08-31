import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import {
  FaUserFriends,
  FaUserPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [current, setCurrent] = useState({ _id: null, name: "", email: "" })
  const [isEdit, setIsEdit] = useState(false)

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customers");
      setCustomers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers()
  }, [])

  const openForm = (customer = { _id: null, name: "", email: "" }) => {
    setCurrent(customer)
    setIsEdit(!!customer._id)
    setOpenModal(true)
  };

  const closeForm = () => {
    setCurrent({ _id: null, name: "", email: "" });
    setOpenModal(false)
    setIsEdit(false)
  }

  const saveCustomer = async () => {
    try {
      if (isEdit) {
        await axios.put(`/customers/${current._id}`, current)
      } else {
        await axios.post("/customers", current)
      }
      fetchCustomers()
      closeForm()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCustomer = async (id) => {
    await axios.delete(`/customers/${id}`);
    fetchCustomers()
  }

  return (
    <div className="pt-32 p-10 min-h-screen bg-linear-to-b from-[#faf6ef] to-[#e8ddc9]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10">
        <FaUserFriends className="text-4xl text-[#C9A86A] " />
        <h1 className="text-4xl font-bold text-neutral-900">Customers</h1>

      </motion.div>

      <motion.button whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }} onClick={() => openForm()}
        className="flex items-center gap-3 bg-[#C9A86A] text-white
        px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">

        <FaUserPlus />
        Add Customer

      </motion.button>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            className="p-6 bg-white/90 backdrop-blur-xl border border-[#C9A86A]/25
            rounded-2xl shadow-md hover:shadow-xl transition-all">

            <div className="mb-4">
              <p className="text-xl font-semibold text-neutral-800">{c.name}</p>
              <p className="text-neutral-600">{c.email}</p>

            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => openForm(c)}
                className="text-[#C9A86A] hover:text-[#a38552]">
                <FaEdit size={20} />

              </button>

              <button onClick={() => deleteCustomer(c._id)}
                className="text-red-600 hover:text-red-800">
                <FaTrash size={20} />

              </button>

            </div>

          </motion.div>
        ))}
      </div>

      {openModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">

          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 p-7 rounded-3xl w-full max-w-sm shadow-2xl
            border border-[#C9A86A]/40">

            <h2 className="text-2xl font-bold text-neutral-800 mb-5 text-center">
              {isEdit ? "Edit Customer" : "Add Customer"}

            </h2>

            <input type="text" placeholder="Name" value={current.name}
              onChange={(e) =>
                setCurrent({ ...current, name: e.target.value })
              } className="w-full border border-[#C9A86A]/30 rounded-xl mb-4
              focus:ring-2 focus:ring-[#C9A86A] outline-none" />

            <input type="email" placeholder="Email" value={current.email}
              onChange={(e) =>
                setCurrent({ ...current, email: e.target.value })
              } className="w-full border border-[#C9A86A]/30 rounded-xl mb-4
              focus:ring-2 focus:ring-[#C9A86A] outline-none" />

            <div className="flex justify-between mt-6">
              <button onClick={closeForm} className="px-4 py-2 bg-gray-300 rounded-xl
                font-medium hover:bg-gray-400 transition">
                Cancel

              </button>

              <button onClick={saveCustomer} className="px-4 py-2 bg-[#C9A86A] rounded-xl
                font-semibold shadow-md  hover:shadow-lg transition">
                {isEdit ? "Update" : "Add"}

              </button>

            </div>

          </motion.div>

        </motion.div>
      )}

    </div>
  )
};

export default Customers;