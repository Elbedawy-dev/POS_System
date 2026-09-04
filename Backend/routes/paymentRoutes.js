import express from "express";
import { createPaymentIntention, paymobWebhook } from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Called by our own frontend, so it goes through the normal auth middleware.
router.post("/create-intention", protect, createPaymentIntention);

// Called by Paymob's servers directly — NOT protected by our JWT auth.
// Its own security comes from the HMAC signature verified inside paymobWebhook.
router.post("/webhook", paymobWebhook);

export default router;