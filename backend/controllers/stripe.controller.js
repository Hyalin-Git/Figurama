const OrderModel = require("../models/Order.model");
const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "./config/.env" });
const stripe = require("stripe")(`${process.env.STRIPE_PRIVATE_KEY}`);

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
	const addressSupp = req.body.addressSupp;
	const phone = req.body.phone;
	const zip = req.body.zip;
	const city = req.body.city;

	const email = req.body.email;

	const items = req.body.items;
	const itemsMap = items.map((products) => {
		return products.productId.price * products.quantity;
	});

	await stripe.paymentIntents.create(
		{
			amount: calculateOrderAmount(itemsMap),
			currency: "eur",
			payment_method_types: ["card"],
			receipt_email: email,
			metadata: {
				products: JSON.stringify(
					items.map((products) => {
						return products.productId._id;
					})
				),
				// user info
				userId: userId,
				address: address,
				addressSupp: addressSupp,
				phone: phone,
				zip: zip,
				city: city,
			},
		},
		(err, data) => {
			if (err) {
				res.status(500).send(err);
			}
			if (data) {
				res.status(200).send({ clientSecret: data.client_secret });
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

	// Handle the event
	switch (event.type) {
		case "payment_intent.succeeded":
			// Then save an order into the DB if the event payment_intent.succeeded
			const order = new OrderModel({
				order: uuidv4(),
				user: metadata.userId,
				shippingAddress: {
					address: metadata.address,
					addressSupp: metadata.addressSupp,
					phone: metadata.phone,
					zip: metadata.zip,
					city: metadata.city,
				},
				amount: event.data.object.amount,
			});
			try {
				const savedOrder = await order.save();
				if (savedOrder) {
					// Parse the metadata to able to use it
					const products = JSON.parse(metadata.products);
					products.map((id) => {
						// Map through it
						return (
							ProductModel.findById({ _id: id })
								// Return every selectionned product
								.then((product) => {
									// Check in the purchasers Array if there is already the userId
									const thePurchaser = product.purchasers.find((purchaser) =>
										purchaser.purchasers.equals(metadata.userId)
									);
									if (thePurchaser) {
										return; // If yes we are not going any further
									} else {
										// Else we are pushing the userId in the purchasers Array
										ProductModel.findByIdAndUpdate(
											{ _id: id },
											{
												$push: {
													purchasers: {
														purchasers: metadata.userId,
													},
												},
											},
											{ new: true }
										)
											// .then((data) => res.status(200).send(data))
											.catch((err) => console.log(err));
									}
									// Saving the product
									return product.save((err) => {
										if (!err) return console.log(data);
										return console.log(err);
									});
								})
								.catch((err) => console.log(err))
						);
					});
				}
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
