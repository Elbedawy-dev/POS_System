import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { FiUsers, FiEdit, FiTrash2, FiPlus, FiMail, FiShield } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {

  const [users, setUsers] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    _id: null,
    name: "",
    email: "",
    role: "user",
    password: "",
  })

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users")
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEdit(true)
      setCurrentUser({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
      })
    } else {
      setIsEdit(false)
      setCurrentUser({
        _id: null,
        name: "",
        email: "",
        role: "user",
        password: "",
      })
    }
    setOpenModal(true)
  };

  const handleSaveUser = async () => {
    try {
      if (isEdit) {
        await axios.put(`/admin/users/${currentUser._id}`, currentUser)
      } else {
        await axios.post("/admin/users", currentUser)
      }
      fetchUsers()
      setOpenModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!id) return;

    try {
      await axios.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 bg-linear-to-b from-[#faf6ef]
    to-[#e8ddc9] pt-32 h-screen mx-auto">

      <motion.h2 initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FiUsers /> Users

      </motion.h2>

      <button onClick={() => handleOpenModal()}
        className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-xl
        flex items-center gap-2 hover:bg-blue-700 transition active:scale-95 shadow-md">
        <FiPlus /> Add User

      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div key={user._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-white border border-gray-200
            rounded-xl p-5 shadow-sm hover:shadow-lg transition">

            <h3 className="text-xl font-semibold">
              {user.name}
            </h3>

            <p className="text-gray-500 mt-1 items-center gap-2 text-sm">
              <FiMail className="text-gray-400" /> {user.email}

            </p>

            <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
              <FiShield className="text-gray-400" /> {user.role}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => handleOpenModal(user)}
                className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition">
                <FiEdit className="text-yellow-700" />

              </button>
              <button onClick={() => handleDeleteUser(user._id)}
                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition">
                <FiTrash2 className="text-red-700" />

              </button>

            </div>

          </motion.div>
        ))}

      </div>

      {users.length === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-center mt-10">
          No Users available

        </motion.p>
      )}

      <AnimatePresence>
        {openModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-100">

            <motion.div initial={{ scale: 0.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

              <h2 className="text-xl font-semibold mb-4">
                {isEdit ? "Edit User" : "Add User"}
              </h2>

              <div className="space-y-4">

                <input className="w-full p-3 border rounded-lg"
                  placeholder="Name" value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />

                <input className="w-full p-3 border rounded-lg"
                  placeholder="Email" value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />

                <input className="w-full p-3 border rounded-lg"
                  placeholder="Role (admin / user)" value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })} />

                <input className="w-full p-3 border rounded-lg"
                  placeholder="Password" value={currentUser.password}
                  onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })} />

              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                  Cancel

                </button>

                <button onClick={handleSaveUser}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  {isEdit ? "Update" : "Add"}

                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
};

export default Users;