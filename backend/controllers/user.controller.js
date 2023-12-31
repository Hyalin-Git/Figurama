const UserModel = require("../models/User.model");

exports.findAll = (req, res, next) => {
	UserModel.find()
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(404).send(err));
};

exports.findOne = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(404).send(err));
};

exports.findOneAndUpdate = async (req, res, next) => {
	await UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		// the user can change his address
		{
			$set: {
				shippingAddress: {
					address: req.body.address,
					addressSupp: req.body.addressSupp,
					phone: req.body.phone,
					city: req.body.city,
					zip: req.body.zip,
				},
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

exports.findOneAndDeleteShippingAddress = async (req, res, next) => {
	await UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: { shippingAddress: [] } }
	)
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};

exports.findOneAndDelete = (req, res, next) => {
	UserModel.findByIdAndDelete({ _id: req.params.id })
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
	UserModel.findById({ _id: req.params.id }, { cart: 1 })
		.populate("cart.productId")
		.exec()
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};
