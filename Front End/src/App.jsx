import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Header from "./components/Header";
import Login from "./Pages/Login";
import Register from "./Pages/Register"
import Notifications from "./Pages/Notifications";
import Products from "./Pages/Products"
import Profile from "./Pages/Profile"
import Invoices from "./Pages/Invoices";
import Reports from "./Pages/Reports";
import Customers from "./Pages/Customers"
import CreateProduct from "./Pages/CreateProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProduct from "./Pages/EditProduct";
import Home from "./Pages/Home";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} /> 
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/products/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/products/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
 