import Invoice from "../models/Invoice.js"
import Product from "../models/Product.js"
import Counter from "../models/Counter.js"

export const createInvoice = async (req, res) => {
  try {
    const { items, discount = 0, tax = 0, paymentMethod, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invoice must contain at least one item." });
    }

    // Validate stock BEFORE creating the invoice / deducting anything
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      const qty = Number(item.qty) || 0;
      if (qty <= 0) {
        return res.status(400).json({ message: `Invalid quantity for product: ${product.name}` });
      }
      if (product.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}" - available: ${product.stock}, requested: ${qty}`,
        });
      }
    }

    // Atomic invoice number generation (avoids race condition / duplicate invoiceNumber)
    const counter = await Counter.findOneAndUpdate(
      { _id: "invoiceNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const invoiceNumber = counter.seq;

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

    // Deduct stock only after the invoice is persisted
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId, stock: { $gte: Number(item.qty) } },
        { $inc: { stock: -Number(item.qty) } }
      );
    }

    // Populate before sending
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
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("cashier", "name")
      .populate("customer");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};