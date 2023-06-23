const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		order: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		shippingAddress: {
			type: [
				{
					address: {
						type: String,
						maxlength: 50,
						trim: true,
						required: true,
						default: "",
					},
					addressSupp: { type: String, maxlength: 50, trim: true, default: "" },
					phone: {
						type: String,
						maxlength: 15,
						trim: true,
						required: true,
						default: "",
					},
					city: {
						type: String,
						maxlength: 35,
						trim: true,
						required: true,
						default: "",
					},
					zip: {
						type: String,
						maxlength: 12,
						trim: true,
						required: true,
						default: "",
					},
				},
			],
		},
		amount: { type: Number, required: true },
		status: { type: String, default: "pending" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", orderSchema);
