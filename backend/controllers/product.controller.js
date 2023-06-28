const ProductModel = require("../models/Product.model");
const cloudinary = require("../config/cloudinary");

exports.addOneProduct = async (req, res, next) => {
	// stocking covers img in Cloudinary
	try {
		let coverFile = req.files["cover"];

		let coverPath = coverFile[0].path;
		const uploadedCoverResponse = await cloudinary.uploader.upload(coverPath, {
			upload_preset: "dev_preset",
		});
		// Stocking pictures img in cloudinary
		let picturesFiles = req.files["pictures"];

		if (picturesFiles.length > 6) {
			return res
				.status(500)
				.send({ error: "Seules 6 images peuvent être sélectionné" });
		}
		// Map through all the selectioned pictures
		let multiplePicturePromise = picturesFiles.map((picture) =>
			// Call cloudinary for each picture and upload them to upload_preset
			cloudinary.uploader.upload(picture.path, {
				upload_preset: "dev_preset",
			})
		);
		let pictureResponse = await Promise.all(multiplePicturePromise);
		const product = new ProductModel({
			name: req.body.name,
			description: req.body.description,
			universe: ["All", req.body.universe.toLowerCase()],
			brand: req.body.brand,
			cover: uploadedCoverResponse.url,
			pictures: pictureResponse.map((url) => {
				return url.url;
			}),
			price: req.body.price,
			inStock: req.body.inStock,
		});
		product
			.save()
			.then((data) => res.status(201).send(data))
			.catch((err) => res.status(500).send(err));
	} catch (err) {
		console.log(err);
	}
};

exports.getAllProduct = async (req, res, next) => {
	const page = parseInt(req.query.page) - 1 || 0;
	const limit = parseInt(req.query.limit) || 5;

	// search for products by name
	let searchItem = req.query.search;
	const searchProduct = () => {
		if (req.query.search) {
			return {
				name: { $regex: searchItem, $options: "i" },
			};
		}
	};

	let sortByUniverse = req.query.sortByUniverse || "All";
	const whereUniverse = () => {
		if (req.query.sortByUniverse) {
			sortByUniverse = req.query.sortByUniverse.split(",");

			return sortByUniverse;
		} else {
			return "All";
		}
	};

	// can be "asc or desc";
	let sortBy = req.query.sortBy; // filter products by date of addition
	let sortByName = req.query.sortByName; // filter products by alphabet
	let sortByPrice = req.query.sortByPrice; // filter products from the most to the least expensive
	const sort = () => {
		if (req.query.sortBy) {
			return {
				createdAt: sortBy,
			};
		} else if (req.query.sortByName) {
			return {
				name: sortByName,
			};
		} else if (req.query.sortByPrice) {
			return {
				price: sortByPrice,
			};
		}
	};

	// Count the total of products depending on the universe research
	const total = await ProductModel.countDocuments({
		universe: sortByUniverse
			? { $regex: sortByUniverse, $options: "i" } // If there is a specified universe, count it
			: "All", // Else count every product since they all have "ALL"
	});

	const params = {
		error: false,
		search: searchItem,
		universe: sortByUniverse,
		sortBy: sortBy,
		sortByName: sortByName,
		sortByPrice: sortByPrice,
		page: page + 1,
		limit,
		total,
	};

	ProductModel.find(searchProduct())
		.where("universe")
		.in(whereUniverse())
		.sort(sort())
		.skip(page * limit)
		.limit(limit)
		.then((data) => res.status(200).send({ params: params, products: data }))
		.catch((err) => res.status(500).send(err));
};

// Get universe product
exports.getUniverseProduct = async (req, res, next) => {
	ProductModel.find({}, { universe: 1 })
		.then((data) => res.status(201).send({ universe: data }))
		.catch((err) => res.status(500).send(err));
};

// Get one product
exports.getOneProduct = (req, res, next) => {
	ProductModel.findById({ _id: req.params.id })
		.populate(
			"comments.commenterId",
			"lastName firstName email createdAt updatedAt"
		)
		.exec()
		.then((data) => res.status(200).send(data))
		.catch((err) => res.status(404).send(err));
};
// Get the product and update it
exports.getOneAndUpdate = (req, res, next) => {
	ProductModel.findByIdAndUpdate({ _id: req.params.id });
};

// Get the product and delete it
exports.getOneProductAndDelete = (req, res, next) => {
	ProductModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => {
			if (!data) {
				return res.status(404).send({ message: "Produit non trouvé" });
			} else {
				return res
					.status(200)
					.send({ product: data, message: "Produit supprimé" });
			}
		})
		.catch((err) => res.status(404).send(err));
};

exports.addComment = (req, res, next) => {
	ProductModel.findOneAndUpdate(
		{ _id: req.params.id },
		{
			$push: {
				ratings: req.body.rating,

				comments: {
					commenterId: req.body.commenterId,
					comment: req.body.comment,
					rating: req.body.rating,
					timestamp: new Date().getTime(),
				},
			},
		},
		{ new: true }
	)
		.then((data) => {
			data.save();
			return res.status(201).send(data);
		})
		.catch((err) => res.status(500).send(err));
};

exports.editOneComment = (req, res, next) => {
	ProductModel.findById({ _id: req.params.id })
		.then((data) => {
			const theComment = data.comments.find((comment) =>
				comment._id.equals(req.body.commentId)
			);

			if (!theComment) {
				return res.status(404).send("Aucun commentaire trouvé");
			} else {
				theComment.comment = req.body.comment;
			}
			return data.save((err) => {
				if (!err) return res.status(200).send(data);
				return res.status(500).send(err);
			});
		})
		.catch((err) => res.status(500).send(err));
};

exports.deleteOneComment = (req, res, next) => {
	ProductModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{
			$pull: {
				comments: {
					_id: req.body.commentId,
				},
			},
		},
		{ new: true }
	)
		.then(() => res.status(200).send({ message: "Commentaire retiré" }))
		.catch((err) => res.status(400).send(err));
};
