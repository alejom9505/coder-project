//Definiendo el router
const express = require("express");
const carts = express.Router();

//Controllers
const cartsController = require("../controllers/cart");

// '/api/cart/' => POST
carts.post("/", cartsController.postCart);

// '/api/products/:pid' => GET
carts.get("/:cid", cartsController.getCartById);

// '/api/products/:cid/product/:pid' => POST
carts.post("/:cid/product/:pid", cartsController.postAddCartItem);

module.exports = carts;
