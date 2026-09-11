import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  Users,
  Receipt,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Plus,
  BarChart3,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { AuthContext } from "../Context/AuthContext";
import api from "../api/axios";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [meRes, prodRes, invRes, custRes, dailyRes] = await Promise.allSettled([
        api.get("/auth/me"),
        api.get("/products"),
        api.get("/invoices"),
        api.get("/customers"),
        api.post("/reports/daily"),
      ]);

      if (meRes.status === "fulfilled") {
        setUserData(meRes.value.data);
      }
      if (prodRes.status === "fulfilled") {
        setProducts(Array.isArray(prodRes.value.data) ? prodRes.value.data : []);
      }
      if (invRes.status === "fulfilled") {
        setInvoices(Array.isArray(invRes.value.data) ? invRes.value.data : []);
      }
      if (custRes.status === "fulfilled") {
        setCustomers(Array.isArray(custRes.value.data) ? custRes.value.data : []);
      }
      if (dailyRes.status === "fulfilled") {
        setDailyData(dailyRes.value.data);
      }

      const allFailed = [meRes, prodRes, invRes, custRes, dailyRes].every(
        (r) => r.status === "rejected");
        
      if (allFailed) {
        setError("Failed to fetch dashboard data. Please check your connection.");
      }
    } catch (err) {
      console.error("Error loading home dashboard data:", err);
      setError("An unexpected error occurred while loading the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentUser = userData || user;
  const userName = currentUser?.name || currentUser?.email?.split("@")[0] || "User";
  const userRole = currentUser?.role || "Staff";

  // Low stock products filter
  const lowStockProducts = products.filter(
    (p) =>
      typeof p.stock === "number" &&
      typeof p.minStock === "number" &&
      p.stock <= p.minStock
  );

  // Today's invoices & sales fallback calculation
  const todayInvoices = invoices.filter((inv) => {
    if (!inv.createdAt) return false;
    const invDate = new Date(inv.createdAt).toDateString();
    const todayDate = new Date().toDateString();
    return invDate === todayDate;
  });

  const todaySalesCalculated = todayInvoices.reduce(
    (acc, inv) => acc + Number(inv.finalTotal || inv.subTotal || 0),
    0
  );

  const totalSalesDisplay =
    dailyData?.totalSales !== undefined && dailyData?.totalSales !== null
      ? dailyData.totalSales
      : todayInvoices.length > 0
      ? todaySalesCalculated
      : null;

  const invoicesCountDisplay =
    dailyData?.count !== undefined && dailyData?.count !== null
      ? dailyData.count
      : todayInvoices.length > 0
      ? todayInvoices.length
      : null;

  // Recent 5 invoices sorted by date
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const quickStats = [
    {
      title: "Today's Sales",
      value: loading
        ? "--"
        : totalSalesDisplay !== null
        ? `$${Number(totalSalesDisplay).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$0.00",
      description: "Total revenue recorded today",
      icon: DollarSign,
      highlight: false,
    },
    {
      title: "Today's Invoices",
      value: loading
        ? "--"
        : invoicesCountDisplay !== null
        ? invoicesCountDisplay
        : "0",
      description: "Completed sales transactions",
      icon: Receipt,
      highlight: false,
    },
    {
      title: "Low Stock Items",
      value: loading ? "--" : lowStockProducts.length,
      description:
        lowStockProducts.length > 0
          ? `${lowStockProducts.length} item(s) require restock`
          : "Inventory level optimal",
      icon: AlertCircle,
      highlight: lowStockProducts.length > 0,
    },
    {
      title: "Total Customers",
      value: loading ? "--" : customers.length,
      description: "Registered customer profiles",
      icon: Users,
      highlight: false,
    },
  ];

  const quickActions = [
    {
      title: "New Sale",
      path: "/sales",
      description: "Launch checkout counter & process immediate sale",
      icon: ShoppingCart,
      badgeText: "POS Terminal",
    },
    {
      title: "Add Product",
      path: "/products/create",
      description: "Register new item, pricing & stock thresholds",
      icon: Plus,
      badgeText: "Inventory",
    },
    {
      title: "View Invoices",
      path: "/invoices",
      description: "Browse past transaction receipts & payment status",
      icon: Receipt,
      badgeText: "Sales History",
    },
    {
      title: "View Reports",
      path: "/reports",
      description: "Analyze daily revenue charts & top selling products",
      icon: BarChart3,
      badgeText: "Analytics",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-8 md:p-10 bg-gradient-to-b from-[#faf6ef] to-[#f0e5d2]"
    >
      <div className="pt-22 min-h-screen max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Error Notification Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 
            bg-red-50 border border-red-200 text-red-800 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-100 
              hover:bg-red-200 text-red-900 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </motion.div>
        )}

        {/* 1. Welcome Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white/80 
          backdrop-blur-xl border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1 bg-[#C9A86A]/20 border border-[#C9A86A]/30 rounded-xl flex 
              items-center gap-1.5 text-xs font-semibold text-[#8C6D33]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Point of Sale Dashboard</span>
              </div>
              <span className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700 
              text-xs font-semibold rounded-full uppercase tracking-wider">
                {userRole}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              {getGreeting()},{" "}
              <span className="text-[#C9A86A]">{userName}</span>
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base max-w-xl">
              Welcome back! Here is your store's live performance summary and 
              quick daily management actions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 shadow-xs text-xs sm:text-sm font-medium text-neutral-700">
              <Calendar className="w-4 h-4 text-[#C9A86A]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>System operational & updated</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Quick Stats Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#C9A86A]" />
              <span>Performance Overview</span>
            </h2>
            {loading && (
              <span className="text-xs text-neutral-500 animate-pulse font-medium">
                Syncing data...
              </span>
            )}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {quickStats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`p-5 sm:p-6 bg-white/90 backdrop-blur-xl border rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 ${
                    stat.highlight
                      ? "border-amber-300/80 bg-amber-50/40"
                      : "border-neutral-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm font-semibold text-neutral-600">
                      {stat.title}
                    </span>
                    <div
                      className={`p-3 rounded-xl border ${
                        stat.highlight
                          ? "bg-amber-100/80 border-amber-200 text-amber-700"
                          : "bg-[#C9A86A]/15 border-[#C9A86A]/30 text-[#C9A86A]"
                      }`}
                    >
                      <StatIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs ${
                        stat.highlight
                          ? "text-amber-800 font-semibold"
                          : "text-neutral-500 font-medium"
                      }`}
                    >
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* 3. Quick Actions Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-[#C9A86A]" />
              <span>Quick Actions</span>
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Link key={index} to={action.path} className="block group">
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="h-full p-5 sm:p-6 bg-white/90 backdrop-blur-xl border border-neutral-200 
                    rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl hover:border-[#C9A86A]/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-[#C9A86A]/15 border border-[#C9A86A]/30 rounded-xl text-[#C9A86A] 
                        group-hover:bg-[#C9A86A] group-hover:text-white transition-colors duration-300">
                          <ActionIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 border border-neutral-200 
                        text-neutral-600 rounded-lg">
                          {action.badgeText}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-[#8C6D33] transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                        {action.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#8C6D33] group-hover:translate-x-1 transition-transform duration-200">
                      <span>Open section</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        </section>

        {/* 5. Low Stock Alert Banner (Warning section - Red/Amber theme) */}
        {!loading && lowStockProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-amber-50/90 border border-amber-300/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 
            shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-red-100 border border-red-200 rounded-xl text-red-600 shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-red-950">
                      Low Stock Attention Required
                    </h2>
                    <span className="px-2.5 py-0.5 bg-red-200/80 text-red-900 border border-red-300 
                    text-xs font-bold rounded-full">
                      {lowStockProducts.length} {lowStockProducts.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 mt-0.5">
                    The following products have reached or dropped below their minimum stock threshold. Please restock soon to avoid shortages.
                  </p>
                </div>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs shrink-0"
              >
                <span>Manage Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {lowStockProducts.map((p) => {
                return (
                  <div
                    key={p._id || p.name}
                    className="p-4 bg-white border border-amber-200/80 rounded-xl shadow-xs flex items-center justify-between gap-3 hover:border-amber-400 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Category: <span className="font-medium text-neutral-700">{p.category || "General"}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-block px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700">
                        Stock: {p.stock}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1 font-medium">
                        Min: {p.minStock}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* 4. Recent Activity / Recent Invoices Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-md space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2.5">
                <Receipt className="w-6 h-6 text-[#C9A86A]" />
                <span>Recent Invoices</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Latest sales transactions recorded in your POS system.
              </p>
            </div>

            <Link
              to="/invoices"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#8C6D33] hover:text-[#C9A86A] transition-colors"
            >
              <span>View All Invoices</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-[#C9A86A] animate-spin mx-auto" />
              <p className="text-sm text-neutral-500 font-medium">
                Loading recent invoices...
              </p>
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="py-10 text-center bg-neutral-50/60 rounded-2xl border border-neutral-200/60">
              <Receipt className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-700 font-semibold text-base">
                No invoices found
              </p>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                Process your first transaction from the New Sale menu.
              </p>
              <Link
                to="/sales"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#C9A86A] hover:bg-[#b59557] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Create Invoice
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                <span className="col-span-3">Invoice #</span>
                <span className="col-span-3">Date & Time</span>
                <span className="col-span-2 text-center">Items</span>
                <span className="col-span-2 text-center">Method</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              {recentInvoices.map((inv) => {
                const invoiceNum =
                  inv.invoiceNumber ||
                  (inv._id ? `INV-${inv._id.substring(0, 6).toUpperCase()}` : "INV-N/A");
                const invDate = inv.createdAt
                  ? new Date(inv.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) +
                    " " +
                    new Date(inv.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A";

                const itemsCount = Array.isArray(inv.items) ? inv.items.length : 0;
                const totalAmount = Number(inv.finalTotal || inv.subTotal || 0);
                const payMethod = (inv.paymentMethod || "cash").toUpperCase();

                return (
                  <motion.div
                    key={inv._id || invoiceNum}
                    whileHover={{ scale: 1.01, x: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      to="/invoices"
                      className="block p-4 bg-white border border-neutral-200/80 hover:border-[#C9A86A]/50 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md transition-all"
                    >
                      {/* Mobile Layout */}
                      <div className="flex md:hidden flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 text-sm">
                              {invoiceNum}
                            </span>
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-semibold rounded-md">
                              {payMethod}
                            </span>
                          </div>
                          <span className="font-extrabold text-neutral-900 text-base">
                            ${totalAmount.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>{invDate}</span>
                          <span>{itemsCount} item(s)</span>
                        </div>
                      </div>

                      {/* Desktop Grid Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center text-sm">
                        <div className="col-span-3 font-bold text-neutral-900 flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-[#C9A86A]" />
                          <span>{invoiceNum}</span>
                        </div>

                        <div className="col-span-3 text-neutral-600 text-xs font-medium">
                          {invDate}
                        </div>

                        <div className="col-span-2 text-center text-neutral-600 text-xs font-medium">
                          {itemsCount} item(s)
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-700 border border-neutral-200 text-xs font-semibold rounded-lg">
                            {payMethod}
                          </span>
                        </div>

                        <div className="col-span-2 text-right font-extrabold text-neutral-900 text-base">
                          ${totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Home;
