const OrderModel = require("../models/Order.model");
const userModel = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "./config/.env" });
const stripe = require("stripe")(`${process.env.STRIPE_PRIVATE_KEY}`);

exports.checkout = async (req, res, next) => {
	await stripe.checkout.sessions.create(
		{
			payment_method_types: ["card"],
			mode: "payment",
			customer_email: req.body.email,
			line_items: req.body.cart.map((item) => {
				return {
					price_data: {
						currency: "eur",
						product_data: {
							name: item.productId.name,
						},
						unit_amount: item.productId.price,
					},
					quantity: item.quantity,
				};
			}),
			success_url: `${process.env.CLIENT_URL}/success`,
			cancel_url: `${process.env.CLIENT_URL}/cancel`,
		},

		(err, data) => {
			if (err) {
				res.status(500).send(err);
			}
			if (data) {
				res.send(data);
				console.log(data);
				const checkout = new CheckoutTTLModel({
					checkoutID: data.id,
					customer_email: data.customer_email,
				});
				checkout.save();
			}
		}
	);
};

function calculateOrderAmount(item) {
	let total = 0;

	for (let i = 0; i < item?.length; i++) {
		total += item[i];
	}

	return total;
}

exports.paymentIntent = async (req, res, next) => {
	const userId = req.body.userId;
	const address = req.body.address;
	const zip = req.body.zip;
	const city = req.body.city;
	const email = req.body.email;
	const items = req.body.items;
	const itemsMap = items.map((products) => {
		return products.productId.price * products.quantity;
	});
	// userId: userId,
	// products: items,
	await stripe.paymentIntents.create(
		{
			amount: calculateOrderAmount(itemsMap),
			currency: "eur",
			payment_method_types: ["card"],
			receipt_email: email,
			metadata: {
				userId: userId,
				line1: address,
				zip_code: zip,
				city: city,
			},
		},
		(err, data) => {
			if (err) {
				res.status(500).send(err);
			}
			if (data) {
				res.status(200).send({ clientSecret: data.client_secret, id: data.id });
			}
		}
	);
};

exports.paymentWebhook = async (req, res, next) => {
	const payload = req.body;
	const sig = req.headers["stripe-signature"];

	let event;
	// checks if it's a stripe event
	try {
		event = stripe.webhooks.constructEvent(
			payload,
			sig,
			`${process.env.STRIPE_ENDPOINT_SECRET}`
		);
		console.log("webhook verified");
	} catch (err) {
		res.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}
	const metadata = event.data.object.metadata;

	console.log(event);
	// Handle the event
	switch (event.type) {
		case "payment_intent.succeeded":
			// Then save an order into the DB if the event payment_intent.succeeded
			const order = new OrderModel({
				order: uuidv4(),
				user: metadata.userId,
				shippingAddress: metadata.line1,
				zip: metadata.zip_code,
				city: metadata.city,
				amount: event.data.object.amount,
			});
			try {
				const savedOrder = await order.save();
				console.log(savedOrder);
			} catch (err) {
				console.log(err);
			}

			break;
		// ... handle other event types
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event
	res.sendStatus(200);
};
