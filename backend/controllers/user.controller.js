const userModel = require("../models/user.model");

exports.findAll = (req, res, next) => {
	userModel
		.find()
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(404).send(err));
};

exports.findOne = (req, res, next) => {
	userModel
		.findById({ _id: req.params.id })
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(404).send(err));
};

exports.findOneAndUpdate = async (req, res, next) => {
	await userModel
		.findByIdAndUpdate(
			{ _id: req.params.id },
			// the user can change his address
			{
				$set: {
					shippingAddress: req.body.shippingAddress,
					city: req.body.city,
					zip: req.body.zip,
				},
			},
			{ setDefaultsOnInsert: true }
		)
		.then((data) => {
			if (!data) {
				return res.status(404).send({ message: "Aucun utilisateur trouvé" });
			} else {
				return res.status(200).send(data);
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.findOneAndDelete = (req, res, next) => {
	userModel
		.findByIdAndDelete({ _id: req.params.id })
		.then((data) => {
			if (!data) {
				return res
					.status(404)
					.send({ user: data, message: "utilisateur non trouvé" });
			} else {
				return res
					.status(200)
					.send({ user: data, message: "utilisateur supprimé" });
			}
		})
		.catch((err) => res.status(404).send({ error: err }));
};

exports.findUserCart = (req, res, next) => {
	userModel
		.findById({ _id: req.params.id }, { cart: 1 })
		.populate("cart.productId")
		.exec()
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};
