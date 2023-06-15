const router = require("express").Router();
const express = require("express");
const stripe = require("stripe")(`${process.env.STRIPE_PRIVATE_KEY}`);

const stripeController = require("../controllers/stripe.controller");
const { authorization } = require("../middlewares/jwt.middleware");

router.post(
	"/create-payment-intent",
	authorization,
	stripeController.paymentIntent
);

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	stripeController.paymentWebhook
);

router.get("stripe/redirect");
module.exports = router;
