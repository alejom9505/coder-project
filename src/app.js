/*----------Module Imports----------*/
//Core modules
const fs = require("fs");
const path = require("path");

//External modules
const express = require("express");
const bodyParser = require("body-parser");

//Routes

//Models
const alejandroManager = require("./models/productManager");

//Controllers
const productController = {
  getProducts: async (req, res, next) => {
    const limit = Number(req.query.limit);
    //console.log(alejandroManager);
    const products = await alejandroManager.getProducts();
    if (!limit) {
      return res.send(products);
    }
    if (!(products.length >= limit)) {
      return res.send({
        error: "El limite excedio la cantidad de productos",
      });
    }
    const productsFilter = products.slice(0, limit);
    res.send(productsFilter);
  },
  getProductsById: async (req, res, next) => {
    const productId = req.params.pid;
    let product;
    if (!(typeof Number(productId) === "number")) {
      product = await alejandroManager.getProductById(productId);
    } else {
      product = await alejandroManager.getProductByAutoId(productId);
    }
    if (!product) {
      return res.send({ error: "Producto no encontrado" });
    }
    res.send(product);
    //
    //
  },
};

//Middlewares

/*----------App----------*/
const app = express();

//Parser Middlewares
app.use(bodyParser.urlencoded({ extended: true }));

//Routing Middlewares

// '/products' => GET
app.get("/products", productController.getProducts);

// '/products/:pid' => GET
app.get("/products/:pid", productController.getProductsById);

//Error Middleware

//Starting server...
app.listen(8080, () => console.log("Server Online!\nListening on port 8080"));
