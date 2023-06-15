const router = require("express").Router();
const { authorization, isAdmin } = require("../middlewares/jwt.middleware");
const productController = require("../controllers/product.controller");
const multer = require("../middlewares/multer.middleware");

router.post(
	"/create-product",
	multer.fields([
		{ name: "cover", maxCount: 1 },
		{ name: "pictures", maxCount: 7 },
	]),
	authorization,
	isAdmin,
	productController.addOneProduct
);
// There is several queries for this route. (check product.controller)
router.get("/", productController.getAllProduct);

router.get("/get-universe", productController.getUniverseProduct);
router.get("/:id", productController.getOneProduct);

router.delete("/:id", authorization, productController.getOneProductAndDelete);

router.patch(
	"/add-comment-product/:id",
	authorization,
	productController.addComment
);
router.patch(
	"/edit-comment-product/:id",
	authorization,
	productController.editOneComment
);
router.patch(
	"/delete-comment-product/:id",
	authorization,
	productController.deleteOneComment
);

module.exports = router;
