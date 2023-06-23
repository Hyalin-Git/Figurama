const router = require("express").Router();
const userController = require("../controllers/user.controller");
const cartController = require("../controllers/cart.controller");
const { authorization } = require("../middlewares/jwt.middleware");
const multer = require("multer");
const upload = multer();

// User routes
router.get("/", authorization, userController.findAll);
router.get("/:id", authorization, userController.findOne);
router.put("/:id", authorization, userController.findOneAndUpdate);
router.put(
	"/delete-shipping-address/:id",
	authorization,
	userController.findOneAndDeleteShippingAddress
);
router.delete("/:id", authorization, userController.findOneAndDelete);

// User cart routes
router.get("/get-cart/:id", authorization, userController.findUserCart);
router.patch(
	"/add-to-cart/:id",
	authorization,
	upload.array(), // Accept multipart/form-data
	cartController.addToCart
);
router.patch("/update-cart/:id", authorization, cartController.updateCart);
router.patch(
	"/delete-cart-item/:id",
	authorization,
	cartController.removeFromCart
);
router.patch(
	"/delete-all-cart-item/:id",
	authorization,
	cartController.removeAllFromCart
);

module.exports = router;
