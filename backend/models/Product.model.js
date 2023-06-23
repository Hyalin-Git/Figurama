const { mongoose } = require("mongoose");

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
		rating: {
			type: Number,
			required: true,
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

module.exports = mongoose.model("Product", productSchema);
