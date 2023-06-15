const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
	// hash le mdp 10x
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new userModel({
				lastName: req.body.lastName,
				firstName: req.body.firstName,
				email: req.body.email,
				// enregistre le password crypté dans la Database
				password: hash,
				isAdmin: req.body.isAdmin,
			});
			user
				.save()
				.then((data) => res.status(201).send(data))
				.catch((err) => res.status(500).send(err));
		})
		.catch((err) => res.stau(500).send(err));
};

exports.signIn = (req, res, next) => {
	userModel
		.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(404).send({ message: "Adresse mail introuvable" });
			} else {
				bcrypt
					.compare(req.body.password, user.password)
					.then((match) => {
						if (!match) {
							return res
								.status(400)
								.send({ message: "Mot de passe incorrect" });
						} else {
							res.cookie("connect.sid", "", { maxAge: 1 });

							const maxAge = 24 * 60 * 60 * 1000;
							const token = jwt.sign(
								{ userId: user.id },
								`${process.env.JWT_SECRET_KEY}`,
								{ expiresIn: maxAge }
							);

							res.cookie("jwt", token, {
								httpOnly: true,
								maxAge: maxAge,
							});

							res.status(200).send({ userId: user._id });
						}
					})
					.catch((err) => res.status(500).send(err));
			}
		})
		.catch((err) => res.status(500).send(err));
};

exports.logout = (req, res, next) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.cookie("connect.sid", "", { maxAge: 1 });
	res.redirect("/");
};
