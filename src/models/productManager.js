//Extrayendo los metodos necesarios del modulo node:fs
const { existsSync, mkdirSync, writeFileSync } = require("node:fs");
//Extrayendo los metodos necesarios del modulo node:fs
const { readFile, writeFile } = require("node:fs/promises");
//Extrayendo los metodos necesarios del modulo node:path
const { join } = require("node:path");

class ProductManager {
  //Variable privadas
  #directoryPath;
  #filePath;

  //Constructor para la clase
  constructor(firstName, lastName, dni) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dni = dni;
    this.#directoryPath = join(
      __dirname.replace("models", ""),
      "db",
      "products"
    );
    this.#filePath = join(
      __dirname.replace("models", ""),
      "db",
      "products",
      `${dni}-products.json`
    );
  }

  //Traer los productos
  async getProducts() {
    try {
      if (!existsSync(this.#directoryPath)) {
        mkdirSync(this.#directoryPath);
      }
      if (!existsSync(this.#filePath)) {
        writeFileSync(this.#filePath, JSON.stringify([]));
      }
      const productString = await readFile(this.#filePath, {
        encoding: "utf-8",
      });
      return JSON.parse(productString);
    } catch (error) {
      error.origin = "getProducts()";
      throw error;
    }
  }

  //Metodo para agregar un producto
  async addProduct(product, productsArray = null) {
    //Desestructurando el producto
    const { title, description, thumbnail, price, stock, code } = product;
    //Validación del producto
    try {
      if (!title || typeof title !== "string") {
        throw new Error("Un título es requerido! / tipo de dato invalido");
      }
      if (!description || typeof description !== "string") {
        throw new Error(
          "Una descripción es requerida! / tipo de dato invalido"
        );
      }
      if (!price || typeof price !== "number") {
        throw new Error("Un precio es requerido! / tipo de dato invalido");
      }
      if (!thumbnail || typeof thumbnail !== "string") {
        throw new Error(
          "Un enlace a la imagen es requerido! / tipo de dato invalido"
        );
      }
      if (!stock || typeof stock !== "number") {
        throw new Error("Una cantidad es requerida! / tipo de dato invalido");
      }
      if (!code || typeof code !== "string") {
        throw new Error("Un codigo es requerido! / tipo de dato invalido");
      }
      //Leyendo los productos
      let products;
      if (!productsArray) {
        products = await this.getProducts();
      } else {
        products = [...productsArray];
      }
      //Verificando que el producto no exista
      if (await this.getProductById(code, products)) {
        throw new Error("Producto existente!");
      }
      //Creando el nuevo producto
      products.push({
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        ...product,
      });
      //Escribiendo el producto
      await writeFile(this.#filePath, JSON.stringify(products));
      return "Producto agregado exitosamente";
    } catch (error) {
      if (!error.origin) {
        error.origin = "addProduct()";
      } else {
        error.origin += error.origin + " -> addProduct()";
      }
      throw error;
    }
  }

  //Buscar un producto por ID Autogenerado
  async getProductByAutoId(id, productsArray = null, flag = false) {
    let products;
    if (!productsArray) {
      try {
        products = await this.getProducts();
      } catch (error) {
        if (!error.origin) {
          error.origin = "getProductById()";
        } else {
          error.origin += error.origin + " -> getProductById()";
        }
        throw error;
      }
    } else {
      products = [...productsArray];
    }
    const product = products.find((product) => product.id === Number(id));
    if (!product) {
      if (flag) console.log("Producto no existente");
      return null;
    }
    return product;
  }

  //Buscar un producto por ID
  async getProductById(code, productsArray = null, flag = false) {
    let products;
    if (!productsArray) {
      try {
        products = await this.getProducts();
      } catch (error) {
        if (!error.origin) {
          error.origin = "getProductById()";
        } else {
          error.origin += error.origin + " -> getProductById()";
        }
        throw error;
      }
    } else {
      products = [...productsArray];
    }
    const product = products.find((product) => product.code === code);
    if (!product) {
      if (flag) console.log("Producto no existente");
      return null;
    }
    return product;
  }

  //Actualizar un objeto
  async updateProduct(code, update, productsArray = null) {
    //Desestructurando el producto
    const { title, description, price, thumbnail, stock } = update;
    //Validación del producto
    try {
      if (update.hasOwnProperty("title")) {
        if (!title || typeof title !== "string") {
          throw new Error("Un título es requerido! / tipo de dato invalido");
        }
      }
      if (update.hasOwnProperty("description")) {
        if (!description || typeof description !== "string") {
          throw new Error(
            "Una descripción es requerida! / tipo de dato invalido"
          );
        }
      }
      if (update.hasOwnProperty("price")) {
        if (!price || typeof price !== "number") {
          throw new Error("Un precio es requerido! / tipo de dato invalido");
        }
      }
      if (update.hasOwnProperty("thumbnail")) {
        if (!thumbnail || typeof thumbnail !== "string") {
          throw new Error(
            "Un enlace a la imagen es requerido! / tipo de dato invalido"
          );
        }
      }
      if (update.hasOwnProperty("stock")) {
        if (!stock || typeof stock !== "number") {
          throw new Error("Una cantidad es requerida! / tipo de dato invalido");
        }
      }
      if (update.hasOwnProperty("code")) {
        throw new Error("No se puede modificar el codigo!");
      }
      //Se traen los productos
      let products;
      if (!productsArray) {
        products = await this.getProducts();
      } else {
        products = [...productsArray];
      }
      //Se busca el indice del producto a actualizar
      const indexOfProduct = products.findIndex(
        (element) => element.code === code
      );
      //Se trae el prodcuto original
      const product = await this.getProductById(code, products);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      //Se crea el producto actualizado
      const updateProduct = { ...product, ...update };
      //Se actualiza el array
      products.splice(indexOfProduct, 1, updateProduct);
      const updateProducts = [...products];
      //Se escribe el archivo
      await writeFile(this.#filePath, JSON.stringify(updateProducts));
      return "Producto actualizado exitosamente";
    } catch (error) {
      if (!error.origin) {
        error.origin = "updateProduct()";
      } else {
        error.origin += error.origin + " -> updateProduct()";
      }
      throw error;
    }
  }
  //Elimina un producto
  async deleteProduct(code, productsArray = null) {
    let products;
    try {
      if (!productsArray) {
        products = await this.getProducts();
      } else {
        products = [...productsArray];
      }
      const updateProducts = products.filter(
        (product) => product.code !== code
      );
      if (products.length === updateProducts.length) {
        throw new Error("El producto no existe");
      }
      await writeFile(this.#filePath, JSON.stringify(updateProducts));
      return "Producto eliminado exitosamente";
    } catch (error) {
      if (!error.origin) {
        error.origin = "deleteProduct()";
      } else {
        error.origin += error.origin + " -> deleteProduct()";
      }
      throw error;
    }
  }
}

//Testing
const alejandro = new ProductManager("Alejandro", "Ochoa", "24300001"); //Se crea instancia la clase

module.exports = alejandro;
