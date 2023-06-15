const { mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		description: {
			type: String,
		},
		universe: {
			type: [String],
		},
		brand: {
			type: String,
		},
		cover: {
			type: String,
		},
		pictures: {
			type: [String],
		},
		price: {
			type: Number,
			default: 0,
		},
		rating: {
			type: Number,
			default: 0,
		},
		comments: {
			type: [
				{
					commenterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
					comment: String,
					timestamps: Number,
				},
			],
		},
		inStock: {
			type: Number,
			min: 0,
			max: 255,
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

module.exports = mongoose.model("Product", productSchema);
