import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await api.get("/admin/auth/me", {
                    withCredentials: true,
                });

                setAdmin(res.data);
            } catch (err) {
                console.log("Auth check failed:", err);
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/admin/auth/login", {email, password,
                },
                {
                    withCredentials: true,
                }
            );

            setAdmin(res.data.admin || res.data);
            setError(null);

            return res.data;
        } catch (err) {
            console.log("Login failed:", err);

            const message =
                err.response?.data?.message ||
                "Invalid email or password";

            setError(message);

            throw err;
        }
    };

    const logout = async () => {
        try {
            await api.get("/admin/auth/logout", {
                withCredentials: true,
            });

            setAdmin(null);
        } catch (err) {
            console.log("Logout failed:", err);
        }
    };

    const register = async (name, email, password, role) => {
        try {
          const res = await api.post("/admin/auth/register", {
              name, email, password, role,
            },

            {
                withCredentials: true,
            }
        );

        setAdmin(res.data.admin);
        setError(null);

        return res.data;
      } catch (err) {
          const message =
              err.response?.data?.message ||
              "Something went wrong";  
          setError(message);  
          throw err;
      }
    };

    return (
       <AdminAuthContext.Provider
           value={{ admin, setAdmin, login, logout, register, error, loading,
           }}>
           {children}
       </AdminAuthContext.Provider>
    );
};

export default AdminAuthContext;