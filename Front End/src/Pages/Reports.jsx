import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar,
  Trophy, 
  BarChart3, 
  TrendingUp, 
  ArrowRight, 
  LineChart, 
  Star,
} from "lucide-react";

import { FaBoxOpen } from "react-icons/fa6";

import { LineChart as RLineChart,
  Line, 
  CartesianGrid,
  XAxis, 
  YAxis, 
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../api/axios";

const Reports = () => {
    const [daily , setDaily] = useState(null)
    const [range , setRange] = useState(null)
    const [topProducts , setTopProducts] = useState([])
    const [dates , setDates] = useState({ start: "", end: "" })
    const [chartData , setChartData] = useState([])

    useEffect(() => {
        api.post('/reports/daily').then((res) => setDaily(res.data))
        api.get('/reports/top-products').then((res) => setTopProducts(res.data))
        api.get('/reports/weekly').then((res) => setChartData(res.data))
    }, [])

    const getRangeReports = () => {
        api.post('/reports/range',  dates).then((res) => setRange(res.data))
    }

return (
  <motion.div className="pt-32 max-w-9xl mx-auto p-10 space-y-16 bg-[#f8f6f1]
        rounded-4xl shadow-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

    <motion.div initial = {{y: -15 , opacity: 0}} animate={{y: 0 , opacity: 1}}
     className = "text-center space-y-4">
        <h1 className="text-5xl font-bold text-neutral-900 flex justify-center
         items-center gap-3">
           <LineChart size={40} className="text-neutral-900" />
              Reports & Insights
        </h1>

        <p className="text-neutral-600 max-w-2xl mx-auto">
            Track daily and periodic sales performance with live
            analytics, product insights, and data-driven visualization.
        </p>
    </motion.div>
    <motion.div className = "grid md:grid-cols-3 gap-8" initial = "hidden" animate = "visible"
    variants = {{
        hidden: { opacity: 0},
        visible: { opacity: 1,  transition: { staggerChildren: 0.15 }},
    }}>
    
    {[
        {
            title: "total sales {Today}",
            value: daily?.totalSales ? `${daily.totalSales} $` : "--",
            icon: <TrendingUp size={30}/>,
        },

        {
            title: "Invoices",
            value: daily?.count || "--",
            icon: <Calendar size={30}/>,
        },

        {
            title: "Top Products",
            value: topProducts[0]?._id || "loading...",
            icon: <Trophy size={30}/>,
        },

    ].map((item, index) => {
      return <motion.div key = {index} variants = {{
            hidden: {opacity: 0, y: 20},
            visible: {opacity: 1, y: 0}
        }} whileHover={{ scale: 1.05 , rotateX: 2 , rotateY: 2 }}
           transition = {{type: "spring", stiffness: 120}} 
           className = "bg-white/90 backdrop-blur-xl border border-black/5 shadow-lg
           rounded-2xl p-6 hover:shadow-2xl">

            <div className = "flex items-center gap-3 mb-3">
                <div className = "p-3 bg-neutral-100 rounded-xl">
                    {item.icon}
                </div>
                <h3 className = "text-lg font-semibold text-neutral-700">
                    {item.title}
                </h3>
            </div>
            <p className = "text-3xl font-bold text-neutral-900">
                {item.value}
            </p>
        </motion.div>
    })}
    </motion.div>

    <motion.section initial = {{opacity:0 , y:30}} animate = {{opacity:1 , y:0}}
        transition = {{delay:0.2}} className = "bg-white rounded-3xl shadow-md p-10
        border border-neutral-200">

        <h2 className = "text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <BarChart3/> Weekly Sales Overview
        </h2>

        <div className="w-full h-80">
        <ResponsiveContainer>
          <RLineChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" stroke="#ddd"/>
            <XAxis dataKey="day"/>
            <YAxis />
            <Tooltip />

            <Line type="monotone" dataKey="sales" stroke="#aE3A5F" strokeWidth={3}

            dot = {{r:4}} activeDot={{r:6}}/>
          </RLineChart>

        </ResponsiveContainer>

        </div>        
    </motion.section>

    <motion.section initial={{opacity: 0,y:30}} animate={{opacity:1,y:0}}
    className="bg-white rounded-3xl p-10 shadow-md border border-neutral-200">

        <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-3">
        <Calendar /> Sales Between Dates
        </h2>

    <form onSubmit={getRangeReports} className="flex flex-col md:flex-row gap-4 items-center mb-6">

        <input type="date" value={dates.start}
            onChange={(e) => setDates({...dates,start:e.target.value})}
            className="border border-neutral-300 rounded-lg px-3 py-2 w-full md:w-auto"
            required />
        <input type="date" value={dates.end}
            onChange={(e)=> setDates({...dates, end:e.target.value})}
            className="border border-neutral-300 rounded-lg px-3 py-2 w-full md:w-auto"
            required />

        <button type="submit" className="bg-neutral-900 text-white px-6 py-2 rounded-lg 
            flex items-center hover:bg-neutral-800 transition gap-2">

            Generate <ArrowRight size = {18} />
        </button>

    </form>

    {range && (
       <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className = "space-y-2
            text-neutral-700">
            
            <p>
                <strong>Total Sales:</strong> {range.total} $
            </p>

            <p>
                <strong>
                    Invoices Count:</strong> {range.invoices.length} $
            </p>
       </motion.div> 


    )}

    </motion.section>

    <motion.section initial={{opacity: 0,y:30}} animate={{opacity:1,y:0}}
    transition={{delay:0.3}} className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-lg 
    border border-neutral-200">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-8 flex items-center gap-3">
            <Star /> Top 10 Products
        </h2>
        <ul className="grid md:grid-cols-2 gap-6 lg:grid-cols-3">
        {topProducts.map((p, index) => (
            <motion.li key={index} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                transition = {{delay: index * 0.05}} whileHover = {{scale: 1.04}}
                className = "p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm 
                hover:shadow-xl flex items-center gap-4">

                <FaBoxOpen className = "text-neutral-700" />

                <div>
                    <p className = "font-semibold text-neutral-800">{p._id}</p>
                    <p className="text-neutral-600">Sold: {p.sold}</p>
                </div>
            </motion.li>
        ))}   
        </ul>
    </motion.section>
</motion.div>
  )
}

export default Reports;
