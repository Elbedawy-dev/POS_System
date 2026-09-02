import AdminRegister from "./Pages/AdminRegister"
import Dashboard from "./Pages/Dashboard";
import AdminLogin from "./Pages/AdminLogin";
import Users from "./Pages/Users";
import Profile from "./Pages/Profile";
import Sales from "./Pages/Sales";
import Customers from "./Pages/Customers";
import Reports from "./Pages/Reports";
import Invoices from "./Pages/Invoices";
import Settings from "./Pages/Settings";
import CreateProduct from "./Pages/CreateProducts"
import Transactions  from "./Pages/Transactions"
import Notifications from "./Pages/Notifications"
import AdminAuthContext from "./Context/AdminAuthContext";
import { AdminAuthProvider } from "./Context/AdminAuthContext";
import Header from "./components/Header"
import { useContext } from "react"
import { BrowserRouter  as Router, Routes, Route, Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const { admin, loading, error } = useContext(AdminAuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!admin) {
        return <Navigate to="/adminlogin" replace />;
    }

    return children;
};

function App() {

  return (
   <AdminAuthProvider>
    <Router>
      <Header />
         <Routes>
          <Route path="/adminregister" element={<AdminRegister />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/products/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
         </Routes>
    </Router>
   </AdminAuthProvider>
  );
};

export default App