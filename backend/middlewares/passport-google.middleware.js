const passport = require("passport");
const userModel = require("../models/user.model");
const GoogleStrategy = require("passport-google-oauth20");

passport.use(
	new GoogleStrategy(
		{
			clientID: `${process.env.CLIENT_ID}`,
			clientSecret: `${process.env.CLIENT_SECRET}`,
			callbackURL: `${process.env.API_URL}/api/auth/google/redirect`,
		},
		async function (accessToken, refreshToken, profile, done) {
			// check if user already exist
			userModel
				.findOne({ googleId: profile.id })
				.then((currentUser) => {
					if (currentUser) {
						// already have the user
						console.log("user is:", currentUser);
						done(null, currentUser);
					} else {
						// if not, create user in db
						const newUser = new userModel({
							googleId: profile.id,
							lastName: profile.name.familyName,
							firstName: profile.name.givenName,
							email: profile._json.email,
						});
						newUser
							.save()
							.then((data) => {
								console.log(data);
								done(null, data);
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	)
);

passport.serializeUser(function (user, done) {
	return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	userModel
		.findById(id)
		.then((user) => {
			return done(null, user);
		})
		.catch((err) => console.log(err));
});
