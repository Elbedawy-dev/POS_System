import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

import {
Receipt,
Plus,
User,
Package,
DollarSign,
CreditCard,
X,

} from "lucide-react";

const Invoices = () => {
    const [invoices, setInvoices] = useState([])    
    const [products, setProducts] = useState([])
    const [customers, setCustomers] = useState([])
    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [checkoutUrl, setCheckoutUrl] = useState(null)
    const [pendingInvoiceId, setPendingInvoiceId] = useState(null)
    const [newInvoice, setNewInvoice] = useState({
        items: [],
        discount: 0,
        tax: 0,
        paymentMethod: 'cash',
        customer: ''
    })

    const fetchAll = async() => {
        try {
            const [invRes , proRes , custRes] = await Promise.all([
                api.get('/invoices'),
                api.get('/products'),
                api.get('/customers'),
            ]) 

            setInvoices(invRes.data)
            setProducts(proRes.data)
            setCustomers(custRes.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll()
    }, [])

    const addItem = () => {
        setNewInvoice({
            ...newInvoice,
            items: [...newInvoice.items, { productId: '', qty: 1, total: 0 }]
        })
    }

    const updateItem = (idx, field, value) => {
    const items = [...newInvoice.items];

    items [idx] [field] = field === "qty" ? Number(value): value;
    const product = products.find((p) => p._id === items [idx].productId);

    if (product) {

    const price = Number(product.sellingPrice) || 0;
    const qty = Number(items [idx].qty) || 1;
    items[idx].total = price * qty;

    } else { 
    items[idx].total = 0;
    }

    setNewInvoice({ ...newInvoice, items });
    }

    const resetInvoiceForm = () => {
        setNewInvoice({
            items: [],
            discount: 0,
            tax: 0,
            paymentMethod: 'cash',
            customer: ''
        })
    }

    const saveInvoices = async() => {
        try {
            setSaving(true)

            // Step 1: create the invoice regardless of payment method.
            // If paymentMethod is "visa" the backend creates it with
            // paymentStatus "pending" and does NOT deduct stock yet.
            const { data: invoice } = await api.post('/invoices', newInvoice)

            if (newInvoice.paymentMethod === 'cash') {
                await fetchAll()
                setOpen(false)
                resetInvoiceForm()
                setSaving(false)
                return
            }

            // Step 2: card payment — ask the backend for a Paymob payment
            // intention for the invoice we just created.
            const { data: intent } = await api.post('/payments/create-intention', {
                invoiceId: invoice._id,
            })

            const url = `https://accept.paymob.com/unifiedcheckout/?publicKey=${intent.publicKey}&clientSecret=${intent.clientSecret}`

            setOpen(false)
            setPendingInvoiceId(invoice._id)
            setCheckoutUrl(url)
        } catch (error) {
            console.error('Error saving invoice:', error)
            alert(error.response?.data?.message || 'Error saving invoice')
        } finally {
            setSaving(false)
        }
    }

    // While the payment iframe is open, poll the invoice every few seconds.
    // Paymob's webhook is what actually flips paymentStatus on the backend —
    // this polling just lets the UI find out and react.
    useEffect(() => {
        if (!pendingInvoiceId) return undefined

        const interval = setInterval(async () => {
            try {
                const { data } = await api.get(`/invoices/${pendingInvoiceId}`)

                if (data.paymentStatus === 'paid') {
                    clearInterval(interval)
                    setCheckoutUrl(null)
                    setPendingInvoiceId(null)
                    await fetchAll()
                    resetInvoiceForm()
                    alert('Payment successful!')
                } else if (data.paymentStatus === 'failed') {
                    clearInterval(interval)
                    setCheckoutUrl(null)
                    setPendingInvoiceId(null)
                    alert('Payment failed. Please try again.')
                }
            } catch (error) {
                console.error(error)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [pendingInvoiceId])

    return (
    <div className="pt-32 p-5 md:px-12 bg-[#f6f4ef] min-h-screen">
        <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} 
        className="flex items-center justify-between mb-10">

        <div className="flex items-center gap-2">
            <div className="p-3 bg-[#C9A86A]/20 border border-[#C9A86A]/40 rounded-xl">
                < Receipt size={25} className="text-[#C9A86A]" />
            </div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-wide">Invoices</h1>
        </div>

    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.98}}
        onClick={()=> setOpen(true)} className="px-3 py-3 flex items-center cursor-pointer
        gap-2 bg-[#C9A86A] text-white text-lg rounded-xl shadow-md hover:bg-[#b8965f]
        transition">

        <Plus size={20} /> Add Invoice
    </motion.button>
    </motion.div>

    <div className = "grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((inv) => (
        <motion.div key = {inv._id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
            whileHover = {{scale: 1.03}} transition = {{type: "spring", stiffness: 200,
            damping: 18}} className = "bg-white p-6 rounded-2xl border border-neutral-200
            shadow-sm hover:shadow-xl cursor-pointer transition group">
            
            <div className = "flex items-center justify-between mb-3">
                <h2 className = "text-xl font-semibold text-neutral-800">
                    Invoice {inv.invoiceNumber}
                </h2>

                <DollarSign className = "text-[#C9A86A]"/>
            </div>

            <p className = "text-sm text-neutral-600 mb-1"> 
                <span className = "font-medium">Customer: </span>

                {""}

                {inv.customer?.name || "N/A"}
            </p>

            <p className = "text-sm text-neutral-600 mb-1"> 
                <span className = "font-medium">Items: </span>

                {""}

                {inv.items.length}
            </p>

            <p className = "text-sm text-neutral-600 mb-1">
                <span className = "font-medium">Payment: </span>
                {inv.paymentMethod === 'visa' ? 'Card' : 'Cash'}
                {inv.paymentMethod === 'visa' && (
                    <span className={
                        inv.paymentStatus === 'paid' ? 'text-green-600 ml-1' :
                        inv.paymentStatus === 'failed' ? 'text-red-600 ml-1' :
                        'text-amber-600 ml-1'
                    }>
                        ({inv.paymentStatus})
                    </span>
                )}
            </p>

            <p className = "text-neutral-600 font-bold mt-3 text-lg">
                {inv.finalTotal} USD
            </p>

            </motion.div>   
        ))}
    </div>

    <AnimatePresence>
    {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 p-4 bg-black/40 backdrop-blur-sm flex justify-center
        items-center z-100">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl border
            border-[#C9A86A]/40">
                
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
                Create Invoice
            </h2>
            <button onClick={() => setOpen(false)}>
                <X className="text-neutral-600 hover:text-red-500 transition" />
            </button>
            </div>

            <div className="mb-4">
            <label className="text-sm font-medium text-neutral-700">
                Select Customer
            </label>

            <select
                className="w-full mt-1 p-3 rounded-xl border bg-neutral-50"
                value={newInvoice.customer} onChange={(e) =>
                setNewInvoice({ ...newInvoice, customer: e.target.value })}>
                <option value="">No Customer</option>
                {customers.map((c) => (
                <option key={c._id} value={c._id}>
                    {c.name}
                </option>
                ))}
            </select>
            </div>
                
        {/* Items */}

        <div className="mb-4">
        <h3 className="font-semibold text-neutral-800 mb-2">Items</h3>

        {newInvoice.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-3 p-2 border bg-neutral-50 rounded-xl">
            <select className="flex-1 min-w-0 p-2 text-sm rounded-lg border" value={item.productId}
            onChange={(e) => updateItem(idx, "productId", e.target.value)}>
                <option value="">Product</option>
                {products.map((p) => (
                <option key = {p._id} value = {p._id}>
                    {p.name} (${p.sellingPrice})
                </option>
                ))}
            </select>

            <input type="number" className="w-16 md:w-40 p-2 text-sm rounded-lg border" value={item.qty}
            onChange={(e) => updateItem(idx, "qty", e.target.value)}/>

            <input disabled className="w-14 md:w-40 p-2 text-sm rounded-lg border bg-white" value={item.total}/>
            </div>
            ))}

            <button onClick={addItem} className="mt-2 px-4 py-2 bg-[#C9A86A] text-white rounded-xl
                hover:bg-[#b8965f] transition"> + Add Item
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
                <label>Discount</label>
                <input type="number" className="w-full p-2 mt-1 border rounded-xl bg-neutral-50"
                value={newInvoice.discount} onChange = {(e) =>
                    setNewInvoice({...newInvoice, discount: parseFloat(e.target.value),
                    })}/>
            </div>

            <div>
                <label>Tax</label>
                <input type="number" className="w-full p-2 mt-1 border rounded-xl bg-neutral-50" 
                value={newInvoice.tax} onChange={(e) => setNewInvoice({ ...newInvoice,
                tax: parseFloat(e.target.value) })}/>
            </div>

            <div>
                <label>Payment </label>
                <select className="w-full p-2 mt-1 border rounded-xl bg-neutral-50" 
                    value={newInvoice.paymentMethod} onChange={(e) => 
                    setNewInvoice({ ...newInvoice, paymentMethod: e.target.value })}>

                    {/* IMPORTANT: this value must match the Invoice model's enum
                        exactly ("cash" | "visa"). "credit_card" is NOT a valid
                        value and was causing the Mongoose validation error. */}
                    <option value="cash">Cash</option>
                    <option value="visa">Card</option>
                </select>
            </div>
        </div>

        <div className = "flex justify-end mt-6">
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.69}} 
                onClick={saveInvoices} disabled={saving} className = "px-6 py-2 bg-[#C9A86A] text-white rounded-xl
                shadow-lg hover:bg-[#b8965f] transition disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Invoice'}
            </motion.button>   
        </div>

            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

    {/* Paymob checkout — opens automatically after saving a "Card" invoice */}
    <AnimatePresence>
    {checkoutUrl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 p-4 bg-black/40 backdrop-blur-sm flex justify-center
        items-center z-100">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border
            border-[#C9A86A]/40 overflow-hidden">

            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <CreditCard size={20} className="text-[#C9A86A]" /> Complete Payment
                </h2>
            </div>

            <iframe
                src={checkoutUrl}
                title="Paymob Checkout"
                width="100%"
                height="600"
                style={{ border: "none" }}
            />
        </motion.div>
        </motion.div>
    )}
    </AnimatePresence>
    </div> 
    )
}

export default Invoices;