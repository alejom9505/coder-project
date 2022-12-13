//Extrayendo los metodos necesarios del modulo node:fs
const { existsSync, mkdirSync, writeFileSync } = require("node:fs");
//Extrayendo los metodos necesarios del modulo node:fs
const { readFile, writeFile } = require("node:fs/promises");
//Extrayendo los metodos necesarios del modulo node:path
const { join } = require("node:path");
//Extrayendo el metodo para crear el id unico
const { v4: uuidv4 } = require("uuid");

class Cart {
  //Variable privadas
  static #directoryPath = join(__dirname.replace("models", ""), "db", "carts");
  #filePath;

  //Constructor para la clase
  constructor(clientDni, flag = false) {
    !flag ? (this.id = uuidv4()) : "";
    this.products = [];
    this.clientDni = clientDni;
    this.#filePath = join(
      __dirname.replace("models", ""),
      "db",
      "carts",
      `${clientDni}-carts.json`
    );
  }

  //Creación del carrito
  static async createCart(clientDni) {
    //Se instancia le carrito
    const cart = new Cart(clientDni);
    try {
      if (!existsSync(this.#directoryPath)) {
        mkdirSync(this.#directoryPath);
      }
      if (!existsSync(cart.#filePath)) {
        writeFileSync(cart.#filePath, JSON.stringify([]));
      }
      const carts = JSON.parse(
        await readFile(cart.#filePath, { encoding: "utf-8" })
      );
      carts.push(cart);
      await writeFile(cart.#filePath, JSON.stringify(carts));
      return cart;
    } catch (error) {
      error.origin = "createCart()";
      throw error;
    }
  }

  //Traer un carrito por su ID
  static async getCartById(cartId, clientDni) {
    const cart = new Cart(clientDni, true);
    try {
      if (!existsSync(this.#directoryPath)) {
        throw new Error("Directorio del archivo no encontrado!");
      }
      if (!existsSync(cart.#filePath)) {
        throw new Error("Archivo no encontrado!");
      }
      const carts = JSON.parse(
        await readFile(cart.#filePath, { encoding: "utf-8" })
      );
      const auxVar = carts.find((cart) => cart.id === cartId);
      if (!auxVar) {
        return null;
      }
      cart.id = auxVar.id;
      cart.products = auxVar.products;
      return cart;
    } catch (error) {
      error.origin = "getCartById()";
      throw error;
    }
  }

  //Añadir un producto al carrito
  addCartItem(productId, productsArray) {
    let product;
    try {
      product = productsArray.find(
        (product) => product.id === Number(productId)
      );
      if (!product) {
        throw new Error("Producto no encontrado en la base de datos!");
      }
    } catch (error) {
      error.origin = "addCartItem()";
      throw error;
    }
    const existingCartItem = this.products.find(
      (product) => product.id === Number(productId)
    );
    let cartItem;
    if (!existingCartItem) {
      cartItem = { id: product.id, quantity: 1 };
      this.products.push(cartItem);
    } else {
      cartItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      const index = this.products.findIndex(
        (product) => product.id === Number(productId)
      );
      this.products.splice(index, 1, cartItem);
    }
    return cartItem;
  }

  //
  async save() {
    try {
      if (!existsSync(Cart.#directoryPath)) {
        throw new Error("Directorio del archivo no encontrado!");
      }
      if (!existsSync(this.#filePath)) {
        throw new Error("Archivo no encontrado!");
      }
      const carts = JSON.parse(
        await readFile(this.#filePath, { encoding: "utf-8" })
      );
      const index = carts.findIndex((cart) => cart.id === this.id);
      carts.splice(index, 1, { ...this });
      await writeFile(this.#filePath, JSON.stringify(carts));

      return this;
    } catch (error) {
      error.origin = "getCartById()";
      throw error;
    }
  }
}

module.exports = Cart;
