const mongoose = require("mongoose");
var validateEmail = function (email) {
	var rgx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return rgx.test(email);
};

const userSchema = new mongoose.Schema(
	{
		googleId: String,
		lastName: {
			type: String,
			minlength: 2,
			maxlength: 25,
			trim: true,
		},
		firstName: {
			type: String,
			minlength: 2,
			maxlength: 25,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: "Email address is required",
			validate: [validateEmail, "Please fill a valid email address"],
		},
		password: {
			type: String,
			trim: true,
		},
		cart: {
			type: [
				{
					productId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "Product",
					},
					quantity: {
						type: Number,
						default: 1,
					},
				},
			],
		},
		shippingAddress: {
			type: String,
			maxlength: 50,
			trim: true,
			default: "",
		},
		city: {
			type: String,
			maxlength: 35,
			trim: true,
			default: "",
		},
		zip: {
			type: String,
			maxlength: 12,
			trim: true,
			default: "",
		},
		isAdmin: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
