import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Notifications = () => {

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [openModal, setOpenModal] = useState(false)
  const [newNote, setNewNote] = useState({ message: "", type: "info" })

  const fetchNotes = async () => {
    try {
      const res = await api.get("/admin/notifications")
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
     
    fetchNotes()
  }, [])

  const handleMarkSeen = async (id) => {
    try {
      const res = await api.put(`/admin/notifications/${id}`, { seen: true })
      setNotifications((prev) =>
        prev.map((note) => (note._id === id ? res.data: note)))
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreate = async () => {
    if (!newNote.message) return;
    try {
      const res = await api.post("/admin/notifications", newNote)
      setNotifications([res.data, ...notifications])
      setNewNote({ message: "", type: "info" })
      setOpenModal(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-lg">Loading...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>
  return (
    <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-screen mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>

        <button onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white
          px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition">

          <FiPlus size={18} /> New

        </button>

      </div>

      <AnimatePresence>
        {notifications.map((note) => {
          let icon;
          let styles;

          switch (note.type) {
            case "transaction":
              icon = <FiCheckCircle className="text-green-600" size={22} />
              styles = "bg-green-50 border-green-300";
              break;

            case "project":
              icon = <FiAlertTriangle className="text-green-600" size={22} />
              styles = "bg-blue-50 border-blue-300";
              break;

            default:
              icon = <FiInfo className="text-gray-600" size={22} />;
              styles = "bg-gray-50 border-gray-300"
          }

          return (
            <motion.div key={note._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout className={`flex items-center justify-between p-4 mb-3 rounded-xl
              border shadow-sm hover:shadow-md transition ${styles}`}>

              <div className="flex items-center gap-3">
                {icon}

                <p className={`font-medium ${note.seen ? "text-gray-400" : "text-gray-800"}`}>
                  {note.message}

                </p>

              </div>

              {!note.seen && (
                <button onClick={() => handleMarkSeen(note._id)}
                  className="text-gray-500 hover:text-red-500 transition">
                  <FiX size={20} />

                </button>
              )}

            </motion.div>
          )
        })}
      </AnimatePresence>

      {openModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">

          <motion.div initial={{ opacity: 0, scale: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl w-80 shadow-xl">

            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Create Notification

            </h3>

            <input type="text" placeholder="Message" className="w-full border p-2 rounded-md mb-3"
              value={newNote.message}
              onChange={(e) =>
                setNewNote({ ...newNote, message: e.target.value })
              } />

            <select className="w-full border p-2 rounded-md" value={newNote.type}
              onChange={(e) =>
                setNewNote({ ...newNote, type: e.target.value })
              }>

              <option value="info">Info</option>
              <option value="transaction">Transaction</option>
              <option value="project">Project</option>

            </select>

            <div className="flex justify-end gap-3 mt-5">

              <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={() => setOpenModal(false)}>
                Cancel

              </button>

              <button className="px-4 py-2 bg-blue-300 rounded-md" onClick={handleCreate}>
                Create

              </button>

            </div>

          </motion.div>

        </div>
      )}

    </div>
  )
};

export default Notifications;