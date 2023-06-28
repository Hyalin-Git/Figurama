const express = require("express");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const stripeRoutes = require("./routes/stripe.routes");
const orderRoutes = require("./routes/order.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
require("./middlewares/passport-google.middleware");
const cors = require("cors");
const { authorization } = require("./middlewares/jwt.middleware");
const multer = require("multer");
const upload = multer();
const app = express();

const corsOptions = {
	origin: `${process.env.CLIENT_URL}`,
	credentials: true,
	allowedHeaders: ["sessionId", "Content-Type"],
	exposedHeaders: ["sessionId"],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: false,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
	// if the request come this url we are not parsing it.
	if (req.originalUrl === "/api/payment/webhook") {
		next();
	} else {
		express.json({ limit: "50mb" })(req, res, next);
	}
});
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// auth routes

app.use(
	session({
		secret: `${process.env.SESSION_SECRET_KEY}`,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			// Cookie expire in 24h
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

// auth routes
app.use("/api/auth", passport.initialize(), authRoutes);
app.use(passport.session());

// get the userId if auth
app.get("/login/success", authorization, (req, res, next) => {
	if (req.cookies.jwt) {
		res.status(200).send({
			error: false,
			message: "Successfully Loged in",
			userId: res.locals.user.id,
		});
	}
});

app.get("/google/login/success", authorization, (req, res, next) => {
	if (req.user) {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).send({
			error: false,
			message: "Successfully Logged in via Google",
			userId: req.user.id,
		});
	}
});

// user routes
app.use("/api/user", userRoutes);
//product routes
app.use("/api/product", productRoutes);

app.use("/api/payment", stripeRoutes);

app.use("/api/order", orderRoutes);

app.listen("5000", () => {
	console.log("listening on port 5000");
});
