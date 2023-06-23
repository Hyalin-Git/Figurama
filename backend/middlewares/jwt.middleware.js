const jwt = require("jsonwebtoken");
const userModel = require("../models/User.model");
require("../middlewares/passport-google.middleware");

exports.authorization = (req, res, next) => {
	const token = req.cookies.jwt;
	// Jwt auth verification
	if (token) {
		jwt.verify(
			token,
			`${process.env.JWT_SECRET_KEY}`,
			async (err, decodedToken) => {
				if (err) {
					res.locals.user = null;
					next();
				} else {
					if (decodedToken) {
						console.log("decoded token: " + decodedToken.userId);
						let user = await userModel.findById(decodedToken.userId);
						res.locals.user = user;
						// console.log("==== Connected user ====", res.locals.user);
						next();
					}
				}
			}
		);
		// Google auth verification
	} else if (req.user) {
		console.log("==== Connected user ====", req.user);
		next();
	} else {
		res.sendStatus(401);
		res.locals.user = null;
	}
};

exports.isAdmin = (req, res, next) => {
	let user = res.locals.user;
	if (user.isAdmin === true) {
		next();
	} else {
		res.sendStatus(401);
	}
};
