const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		order: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

		shippingAddress: { type: String, required: true },
		zip: { type: String, required: true },
		city: { type: String, required: true },
		amount: { type: Number, required: true },
		status: { type: String, default: "pending" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", orderSchema);
