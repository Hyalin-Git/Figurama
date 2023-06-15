const router = require("express").Router();
const orderController = require("../controllers/order.controller");

const { authorization } = require("../middlewares/jwt.middleware");

// Post one order
router.post("/", authorization, orderController.addOrder);
// Get all orders
router.get("/", authorization, orderController.getAllOrder);
// Get one order
router.get("/get-order", authorization, orderController.getOneOrder);
// Delete one order
router.delete("/get-order", authorization, orderController.DeleteOneOrder);

module.exports = router;
