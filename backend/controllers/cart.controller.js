const UserModel = require("../models/User.model");
const ProductModel = require("../models/Product.model");

exports.addToCart = (req, res, next) => {
	ProductModel.findById({ _id: req.body.productId })
		.then((product) => {
			if (!product) {
				return res.status(404).send({ message: "Aucun produit trouvé !" });
			} else {
				UserModel.findById({ _id: req.params.id })
					.then((data) => {
						const theProduct = data.cart.find((product) =>
							product.productId.equals(req.body.productId)
						);
						// if the product is already found in the user's cart it will only change the quantity
						if (theProduct) {
							if (req.body.quantity == 1 || req.body.quantity == null) {
								// if the given quantity is 1 or null then incr 1 to the product quantity
								theProduct.quantity++;
							} else {
								// Addition the current product quantity with the quantity given by the user
								theProduct.quantity = theProduct.quantity + +req.body.quantity;
								// converting req.body.quantity to a number with the + operator
							}
						} else {
							// if not, then push the product in the user's cart
							UserModel.findByIdAndUpdate(
								{ _id: req.params.id },
								{
									$push: {
										cart: {
											productId: product._id,
											quantity: req.body.quantity,
										},
									},
								},
								{ new: true, setDefaultsOnInsert: true, upsert: true }
							)
								// .then((data) => res.status(200).send(data))
								.catch((err) => res.status(500).send(err));
						}

						return data.save((err) => {
							if (!err) return res.status(200).send(data);
							return res.status(500).send(err);
						});
					})
					.catch((err) => res.status(404).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.updateCart = (req, res, next) => {
	UserModel.findById({ _id: req.params.id })
		.populate("cart.productId")
		.exec()
		.then((data) => {
			const theProduct = data.cart.find((product) =>
				product.productId.equals(req.body.productId)
			);

			if (!theProduct) return res.status(404).send("product not found");
			if (req.body.quantity) {
				theProduct.quantity = req.body.quantity;

				if (req.body.quantity > theProduct.productId.inStock) {
					theProduct.quantity = theProduct.productId.inStock;
				}
			}

			return data.save((err) => {
				if (!err) return res.status(200).send(data);
				return res.status(500).send(err);
			});
		})
		.catch((err) => res.status(404).send(err));
};

exports.removeFromCart = (req, res, next) => {
	UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$pull: {
				cart: {
					productId: req.body.productId,
				},
			},
		},
		{ new: true }
	)
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};

exports.removeAllFromCart = (req, res, next) => {
	UserModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { cart: [] } })
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(500).send(err));
};
