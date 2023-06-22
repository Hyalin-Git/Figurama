const router = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
require("../middlewares/passport-google.middleware");

// JWT auth
router.post("/register", authController.signUp);

router.post("/login", authController.signIn);

// Google auth

router.get(
	"/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
	"/google/redirect",
	passport.authenticate("google", {
		failureRedirect: "/login/failure",
		successRedirect: `${process.env.CLIENT_URL}/`,
	})
);
console.log(process.env.CLIENT_URL);

router.get("/login/failure", (req, res, next) => {
	res.status(401).send({ error: true, message: "Log in failure" });
});

router.get("/logout", authController.logout);

module.exports = router;
