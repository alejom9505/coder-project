//Definiendo el router
const express = require("express");
const products = express.Router();

module.exports = function (io) {
  //Controllers
  const productsController = require("../controllers/products")(io);

  ////Routes

  // '/api/products' => GET
  products.get("/", productsController.getProducts);

  // '/api/products/realtimeproducts' => GET
  products.get("/realtimeproducts", productsController.getRealTimeProducts);

  // '/api/products/:pid' => GET
  products.get("/:pid", productsController.getProductById);

  // '/api/products/' => POST
  products.post("/", productsController.postProduct);

  // '/api/products/:pid' => PUT
  products.put("/:pid", productsController.putProduct);

  // '/api/products/:pid' => DELETE
  products.delete("/:pid", productsController.deleteProduct);

  return products;
};
