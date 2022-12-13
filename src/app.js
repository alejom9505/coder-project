/*----------Module Imports----------*/
//Core modules
const fs = require("fs");
const path = require("path");

//External modules
const express = require("express");
const bodyParser = require("body-parser");

//Routes
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");

//Models

//Controllers

//Middlewares
const generalError = require("./middleware/error/general-error");

/*----------App----------*/
const app = express();

//Parser Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routing Middlewares
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);

//Error Middleware
app.use(generalError);

//Starting server...
app.listen(8080, () => console.log("Server Online!\nListening on port 8080"));
