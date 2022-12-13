//Models
const Cart = require("../models/cart");
const alejandroManager = require("../models/productManager");

exports.postCart = async (req, res, next) => {
  try {
    const cart = await Cart.createCart(alejandroManager.dni);
    res
      .status(201)
      .send({ message: "Solcitud exitosa", statusCode: 201, data: cart });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo postCart:";
    }
    next(error);
  }
};

exports.getCartById = async (req, res, next) => {
  const cartId = req.params.cid;
  try {
    const cart = await Cart.getCartById(cartId, alejandroManager.dni);
    if (!cart) {
      const error = new Error("Error de metodo getCartById:", {
        cause: "Carrito no encontrado",
      });
      error.statusCode = 404;
      throw error;
    }
    res.send({ message: "Solcitud exitosa", statusCode: 200, data: cart });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo getCartById:";
    }
    next(error);
  }
};

exports.postAddCartItem = async (req, res, next) => {
  const { cid: cartId, pid: productId } = req.params;
  try {
    const cart = await Cart.getCartById(cartId, alejandroManager.dni);
    if (!cart) {
      throw new Error("Error de metodo postProduct:", {
        cause: "Carrito inexistente!",
      });
    }
    const products = await alejandroManager.getProducts();
    if (!products.length) {
      throw new Error("Error de metodo postProduct:", {
        cause: "No hy productos en la base de datos!",
      });
    }
    cart.addCartItem(productId, products);
    await cart.save();
    res
      .status(201)
      .send({ message: "Solcitud exitosa", statusCode: 200, data: {} });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo postProduct:";
    }
    next(error);
  }
};
