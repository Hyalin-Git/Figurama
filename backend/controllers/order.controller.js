const OrderModel = require("../models/Order.model");
const userModel = require("../models/user.model");
const { v4: uuidv4 } = require("uuid");

exports.addOrder = (req, res, next) => {
	// find the user with the given userId in the body
	userModel
		.findOne({ userId: req.body.user })
		.then((user) => {
			// If cart is empty this return an error
			if (user.cart.length === 0) {
				return res.status(404).send({ message: "Cart is empty" });
			} else {
				// else create an order
				const order = new OrderModel({
					order: uuidv4(), // generate a random orderId
					user: user,
					products: user.cart, // user's cart
					// user's address
					shippingAddress: user.shippingAddress,
					city: user.city,
					zip: user.zip,
				});
				order
					.save()
					// return the orderId generated randomly by uuidv4
					.then((data) => res.status(200).send({ order: data.order }))
					.catch((err) => res.status(500).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

// Get one order by the orderId
exports.getOneOrder = (req, res, next) => {
	OrderModel.findOne({ id: req.query.orderId })
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(404).send(err));
};
// Get all order by the orderId
exports.getAllOrder = (req, res, next) => {
	OrderModel.find()
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};
// Delete one order by the orderId
exports.DeleteOneOrder = (req, res, next) => {
	OrderModel.findOneAndRemove({ id: req.query.orderId })
		.then((data) => {
			if (!data) {
				return res.status(404).send({ message: "Bon de commande introuvable" });
			} else {
				return res.status(200).send({ message: "commande supprimée" });
			}
		})
		.catch((err) => res.status(500).send(err));
};
