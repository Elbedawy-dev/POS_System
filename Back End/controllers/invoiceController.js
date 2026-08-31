import Invoice from "../models/Invoice.js"
import Product from "../models/Product.js"

let invoiceCounter = 1000
export const createInvoice = async (req, res) => {
  try {
    const { items, discount = 0, tax = 0, paymentMethod, customer } = req.body;

    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    const invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1000;

    const subTotal = items.reduce((acc, item) => acc + Number(item.total || 0), 0);
    const finalTotal = subTotal - Number(discount) + Number(tax);

    const invoice = await Invoice.create({
      invoiceNumber,
      items,
      subTotal,
      discount,
      tax,
      finalTotal,
      paymentMethod,
      cashier: req.user._id,
      customer: customer || null,
    });

    for (const i of items) {
      const product = await Product.findById(i.productId);
      if (product) {
        product.stock -= Number(i.qty) || 0;
        await product.save();
      }
    }

    // — Populating before sending
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate("cashier", "name")
      .populate("customer", "name");

    res.json(populatedInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer", "name")
      .populate("cashier", "name");

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  console.log("🔎 getInvoiceById CALLED — Route triggered!");

  const invoice = await Invoice.findById(req.params.id)
    .populate("cashier", "name")
    .populate("customer");

  res.json(invoice);

  console.log("Customer ID in invoice:", invoice?.customer);
};