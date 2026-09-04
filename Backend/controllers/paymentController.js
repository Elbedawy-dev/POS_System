import crypto from "crypto";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

const PAYMOB_INTENTION_URL = "https://accept.paymob.com/v1/intention/";

// Called from the frontend right after a "visa" invoice is created.
// Talks to Paymob and returns a client_secret used to open the checkout iframe.
export const createPaymentIntention = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId).populate(
      "customer",
      "name email phone"
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    if (invoice.paymentMethod !== "visa") {
      return res.status(400).json({ message: "This invoice is not a card payment" });
    }
    if (invoice.paymentStatus === "paid") {
      return res.status(400).json({ message: "This invoice is already paid" });
    }

    // Paymob expects the amount in cents (piasters), never pounds directly.
    const amountCents = Math.round(invoice.finalTotal * 100);

    const [firstName, ...rest] = (invoice.customer?.name || "Walk-in Customer").split(" ");

    const paymobRes = await fetch(PAYMOB_INTENTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Secret key must NEVER be sent to the frontend — only used here, server-side.
        Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: amountCents,
        currency: "EGP",
        payment_methods: [Number(process.env.PAYMOB_CARD_INTEGRATION_ID)],
        // Paymob requires sum(items[].amount * quantity) === amount exactly.
        // Our invoice can have a discount/tax applied on top of the items'
        // subtotal, so a per-product breakdown would rarely match the final
        // total and trigger "unmatched_item_prices". Sending one item for
        // the whole invoice sidesteps that entirely (items is optional).
        items: [
          {
            name: `Invoice #${invoice.invoiceNumber}`,
            amount: amountCents,
            description: `Invoice #${invoice.invoiceNumber} (${invoice.items.length} item(s))`,
            quantity: 1,
          },
        ],
        billing_data: {
          first_name: firstName || "Walk-in",
          last_name: rest.join(" ") || "Customer",
          email: invoice.customer?.email || "customer@example.com",
          phone_number: invoice.customer?.phone || "+201000000000",
          apartment: "NA",
          floor: "NA",
          street: "NA",
          building: "NA",
          city: "Cairo",
          state: "NA",
          country: "EG",
          postal_code: "NA",
        },
        // This is what lets us match Paymob's webhook back to our own invoice.
        // Paymob returns it in the callback as "order.merchant_order_id".
        special_reference: invoice._id.toString(),
      }),
    });

    const data = await paymobRes.json();

    if (!paymobRes.ok) {
      console.error("Paymob intention error:", data);
      return res.status(500).json({ message: "Failed to create payment intention" });
    }

    res.json({
      clientSecret: data.client_secret,
      publicKey: process.env.PAYMOB_PUBLIC_KEY,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Paymob's "Transaction Processed Callback" — a server-to-server POST that is
// the ONLY source of truth for whether a payment actually succeeded.
// Never trust the frontend/iframe alone to mark an invoice as paid.
export const paymobWebhook = async (req, res) => {
  try {
    const hmacFromPaymob = req.query.hmac;
    const { obj } = req.body;

    if (!obj || !hmacFromPaymob) {
      return res.status(400).json({ message: "Malformed callback" });
    }

    const s = obj.source_data || {};

    // Paymob requires these 20 fields concatenated in this EXACT order
    // (no separators) before hashing. Do not reorder or add/remove fields.
    const orderedValues = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id,
      obj.owner,
      obj.pending,
      s.pan,
      s.sub_type,
      s.type,
      obj.success,
    ].map((v) => (v === undefined || v === null ? "" : String(v)));

    const calculatedHmac = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET)
      .update(orderedValues.join(""))
      .digest("hex");

    // timingSafeEqual needs equal-length buffers, hence the length check first.
    const isValid =
      calculatedHmac.length === hmacFromPaymob.length &&
      crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmacFromPaymob));

    if (!isValid) {
      console.warn("Invalid Paymob HMAC — possible forged/tampered callback");
      return res.status(401).json({ message: "Invalid signature" });
    }

    // This is the invoice._id we passed as "special_reference" at intention creation.
    const invoiceId = obj.order?.merchant_order_id;
    if (!invoiceId) {
      return res.status(400).json({ message: "No invoice reference in callback" });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Paymob may retry the same callback, and the customer may also retry
    // payment after an earlier decline (same invoice, new attempt). Only
    // skip when it's already "paid" — that's the one state that must never
    // be overwritten (it would risk double-deducting stock). A "failed"
    // invoice must still be updatable by a later successful attempt.
    if (invoice.paymentStatus === "paid") {
      return res.status(200).json({ message: "Already processed" });
    }

    if (obj.success === true || obj.success === "true") {
      invoice.paymentStatus = "paid";
      invoice.paymobOrderId = String(obj.order?.id || "");
      await invoice.save();

      for (const item of invoice.items) {
        await Product.updateOne(
          { _id: item.productId, stock: { $gte: Number(item.qty) } },
          { $inc: { stock: -Number(item.qty) } }
        );
      }
    } else {
      invoice.paymentStatus = "failed";
      await invoice.save();
    }

    res.status(200).json({ message: "Processed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};