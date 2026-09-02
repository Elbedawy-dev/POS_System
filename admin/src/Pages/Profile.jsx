import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Avatar, Box, Typography, Paper, Divider, Button } from "@mui/material";
import { User, Mail, Calendar, Key } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me')
                setUser(res.data)
            } catch (error) {
                console.error(error) 
                setError("Unable to load profile. Redirecting to login...")
            }
        }

        fetchUser()
    }, [])

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            navigate("/login")
        }, 5000)

        return () => clearTimeout(timer)
    }, [error, navigate])

    if (error) {
        return (
          <Box className="flex flex-col justify-center items-center h-100vh bg-[#f8f6f1] gap-4">
            <Typography variant="h6" className="text-red-500">
                {error}
            </Typography>
          </Box>
        )
    }

    if (!user) {
        return (
          <Box className="flex justify-center items-center h-100vh bg-[#f8f6f1]">
            <Typography variant="h6" className="text-neutral-700">
                Loading user data...
            </Typography>
          </Box>
        )
    }

    const roleColors = {
        admin: "bg-red-500 text-white",
        manager: "bg-blue-500 text-white",
        cashier: "bg-green-500 text-white",
    }

  return (
    <Box className="min-h-screen bg-[#f8f6f1] flex justify-center items-start pt-24 px-4">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="max-w-3xl w-full flex flex-col gap-6">

            <Paper className="p-6 rounded-2xl shadow-xl border-neutral-300 bg-white">

            <Box className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar sx={{ width: 120, height: 120, bgcolor: 'goldenrod', fontSize: 50,
                        border: '4px solid #FFD700' }}>
                        <User size={50} />
                    </Avatar>

                <Box className="flex flex-col gap-3 text-center md:text-left">
                    <Typography variant="h4" className="font-bold text-yellow-600">
                        {user.name}
                    </Typography>

                <Box className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${roleColors[user.role]}`}>
                    {user.role?.toUpperCase()}
                </Box>

                    <Typography className="text-neutral-700">
                        <Mail size={20} className="inline mr-2 text-yellow-500" />
                        {user.email}
                    </Typography>

                    <Typography>
                        <Calendar size={18} className="inline mr-1 text-yellow-500" />
                        joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </Typography>
                </Box>
            </Box>
        </Paper>

        {/* Account Details */}

        <Paper className="p-6 rounded-2xl shadow-xl border border-neutral-300
           bg-white flex flex-col gap-4 mt-4">

            <Typography variant="h5" className="font-bold text-yellow-600">
                Account Details
            </Typography>

            <Divider />

            <Box className="flex items-center gap-3">
                <Key size={22} className="text-yellow-500" />
                <Typography className="text-neutral-700">Password: ********</Typography>

            <Button size="small" variant="contained" className="ml-auto bg-linear-to-r
             from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-yellow-300/40">
                Change Password
            </Button>

            </Box>

            <Box className="flex items-center gap-3">
                <User size={22} className="text-yellow-500" />
                <Typography className="text-neutral-700">Role: {user.role}</Typography>
            </Box>

            <Box className="flex items-center gap-3">
                <Calendar size={22} className="text-yellow-500" />
                <Typography className="text-neutral-700">Account Created:
                    {new Date(user.createdAt).toLocaleString()}</Typography>
            </Box>
        </Paper>

        <Paper className="p-6 rounded-2xl shadow-xl border border-neutral-300 flex flex-col gap-4
        bg-white">
            <Typography variant="h5" className="font-bold text-yellow-600">
                Additional Info
            </Typography>

            <Divider />

            <Typography className="text-neutral-700">
                * * *
            </Typography>

        </Paper>
      </motion.div>
    </Box>
  )
}

export default Profile