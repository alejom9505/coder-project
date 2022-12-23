/*----------Module Imports----------*/
//Core modules
const fs = require("fs");
const path = require("path");

//External modules
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { engine: expressHandleBars } = require("express-handlebars");
const { Server } = require("socket.io");

//Models

//Controllers

//Middlewares
const generalError = require("./middleware/error/general-error");

/*----------App----------*/
const app = express();
const server = http.createServer(app);

//Configure socket IO instance
const io = new Server(server);

//Configure template engine
app.engine("handlebars", expressHandleBars());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Parser Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routes
const productsRoutes = require("./routes/products")(io);
const cartRoutes = require("./routes/cart");

//Routing Middlewares
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", (req, res, next) => {
  res.render("404", {
    pageTitle: "404",
    message: "Not found",
    layout: false,
  });
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//Error Middleware
app.use(generalError);

//Starting server...
server.listen(8080, () => {
  console.log("Server Online!\nListening on port 8080");
});
