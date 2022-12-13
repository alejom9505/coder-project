//Definiendo el router
const express = require("express");
const products = express.Router();

//Controllers
const productsController = require("../controllers/products");

// '/api/products' => GET
products.get("/", productsController.getProducts);

// '/api/products/:pid' => GET
products.get("/:pid", productsController.getProductById);

// '/api/products/' => POST
products.post("/", productsController.postProduct);

// '/api/products/:pid' => PUT
products.put("/:pid", productsController.putProduct);

// '/api/products/:pid' => DELETE
products.delete("/:pid", productsController.deleteProduct);

module.exports = products;
