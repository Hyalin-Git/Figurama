const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		universe: {
			type: [String],
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		cover: {
			type: String,
			required: true,
		},
		pictures: {
			type: [String],
		},
		price: {
			type: Number,
			default: 0,
			required: true,
		},
		ratings: {
			type: [
				{
					type: Number,
					min: 0,
					max: 5,
				},
			],
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		comments: {
			type: [
				{
					commenterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
					comment: String,
					rating: Number,
					timestamps: Number,
				},
			],
		},
		inStock: {
			type: Number,
			min: 0,
			max: 255,
			required: true,
		},
		purchasers: {
			type: [
				{
					purchasers: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

function calculateAverageRating(next) {
	if (this?.ratings?.length > 0) {
		const sumRating = this?.ratings.reduce((acc, rating) => acc + rating, 0);
		this.averageRating = sumRating / this?.ratings.length;
	} else {
		this.averageRating = 0;
	}
	// Effectuer des opérations sur product.inStock ou d'autres propriétés du document
	next();
}

// Middleware pre-save pour mettre à jour la moyenne des ratings avant la sauvegarde
productSchema.pre("save", calculateAverageRating);

// Middleware pre-update pour mettre à jour la moyenne des ratings avant la mise à jour
productSchema.pre("findOneAndUpdate", calculateAverageRating);

module.exports = mongoose.model("Product", productSchema);
