import Invoice from "../models/Invoice.js"
import Product from "../models/Product.js"
import Counter from "../models/Counter.js"

export const createInvoice = async (req, res) => {
  try {
    const { items, discount = 0, tax = 0, paymentMethod, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invoice must contain at least one item." });
    }

    // Validate stock BEFORE creating the invoice / deducting anything.
    // Also enrich each item with the product's real name/price — the
    // frontend (Invoices.jsx) only sends productId/qty/total, so without
    // this, item.name and item.price stay empty (which later breaks the
    // Paymob payment intention, since it requires a name + amount per item).
    const enrichedItems = [];
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

      enrichedItems.push({
        productId: item.productId,
        name: item.name || product.name,
        qty,
        price: item.price || product.sellingPrice,
        total: Number(item.total) || product.sellingPrice * qty,
      });
    }

    // Atomic invoice number generation (avoids race condition / duplicate invoiceNumber)
    const counter = await Counter.findOneAndUpdate(
      { _id: "invoiceNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const invoiceNumber = counter.seq;

    const subTotal = enrichedItems.reduce((acc, item) => acc + Number(item.total || 0), 0);
    const finalTotal = subTotal - Number(discount) + Number(tax);

    // Card ("visa") invoices start as "pending" until Paymob's webhook confirms
    // the money actually arrived. Cash is considered paid on the spot.
    const paymentStatus = paymentMethod === "visa" ? "pending" : "paid";

    const invoice = await Invoice.create({
      invoiceNumber,
      items: enrichedItems,
      subTotal,
      discount,
      tax,
      finalTotal,
      paymentMethod,
      paymentStatus,
      cashier: req.user._id,
      customer: customer || null,
    });

    // Only deduct stock once the money is secured. For cash that's immediately;
    // for card, the paymobWebhook handler deducts it once payment is confirmed
    // (avoids selling stock for a card payment that ends up failing).
    if (paymentStatus === "paid") {
      for (const item of enrichedItems) {
        await Product.updateOne(
          { _id: item.productId, stock: { $gte: Number(item.qty) } },
          { $inc: { stock: -Number(item.qty) } }
        );
      }
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