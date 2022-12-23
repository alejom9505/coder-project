//Models
const alejandroManager = require("../models/productManager");

module.exports = function (io) {
  return {
    getProducts: async (req, res, next) => {
      const limit = Number(req.query.limit);
      try {
        const products = await alejandroManager.getProducts();
        if (!limit) {
          return (
            res
              .status(200)
              //.send({ message: "Solcitud exitosa", statusCode: 200, data: products });
              .render("home", {
                pageTitle: "Home",
                products: products,
                layout: false,
              })
          );
        }
        if (!(products.length >= limit)) {
          throw new Error("Error de metodo getProducts:", {
            cause: "El limite excedió la cantidad de productos",
          });
        }
        const productsFilter = products.slice(0, limit);
        // res.status(200).send({
        //   message: "Solcitud exitosa",
        //   statusCode: 200,
        //   data: productsFilter,
        // });
        res.status(200).render("home", {
          pageTitle: "Home",
          products: productsFilter,
          layout: false,
        });
      } catch (error) {
        if (!error.message) {
          error.message = "Error de metodo getProducts:";
        }
        next(error);
      }
    },
    getRealTimeProducts: async (req, res, next) => {
      try {
        const products = await alejandroManager.getProducts();
        res.status(200).render("realTimeProducts", {
          pageTitle: "RealTimeProducts",
          products: products,
          layout: false,
        });
      } catch (error) {
        if (!error.message) {
          error.message = "Error de metodo getProducts:";
        }
        next(error);
      }
    },
    getProductById: async (req, res, next) => {
      const productId = req.params.pid;
      let product;
      try {
        if (isNaN(Number(productId))) {
          product = await alejandroManager.getProductById(productId);
        } else {
          product = await alejandroManager.getProductByAutoId(productId);
        }
        if (!product) {
          const error = new Error("Error de metodo getProductById:", {
            cause: "Producto no encontrado",
          });
          error.statusCode = 404;
          throw error;
        }
        res.send({
          message: "Solcitud exitosa",
          statusCode: 200,
          data: product,
        });
      } catch (error) {
        if (!error.message) {
          error.message = "Error de metodo getProductById:";
        }
        next(error);
      }
    },
    postProduct: async (req, res, next) => {
      const product = req.body;
      try {
        const newProduct = await alejandroManager.addProduct(product);
        io.emit("toClient", newProduct);
        res.status(201).send({
          message: "Solcitud exitosa",
          statusCode: 201,
          data: newProduct,
        });
      } catch (error) {
        if (!error.message) {
          error.message = "Error de metodo postProduct:";
        }
        next(error);
      }
    },
    putProduct: async (req, res, next) => {
      const productId = req.params.pid;
      const productUpdate = req.body;
      try {
        const updateproduct = await alejandroManager.updateProduct(
          productId,
          productUpdate
        );
        res.status(200).send({
          message: "Solcitud exitosa",
          statusCode: 200,
          data: updateproduct,
        });
      } catch (error) {
        if (!error.message) {
          error.message = "Error de metodo putProduct:";
        }
        next(error);
      }
    },
    deleteProduct: async (req, res, next) => {
      const productId = req.params.pid;
      try {
        const result = await alejandroManager.deleteProduct(productId);
        res
          .status(200)
          .send({ message: "Solcitud exitosa", statusCode: 200, data: result });
      } catch (error) {
        if (!error.message) {
          error.message = "Error de metodo deleteProduct:";
        }
        next(error);
      }
    },
  };
};

/*exports.getProducts = async (req, res, next) => {
  const limit = Number(req.query.limit);
  try {
    const products = await alejandroManager.getProducts();
    if (!limit) {
      return (
        res
          .status(200)
          //.send({ message: "Solcitud exitosa", statusCode: 200, data: products });
          .render("home", {
            pageTitle: "Home",
            products: products,
            layout: false,
          })
      );
    }
    if (!(products.length >= limit)) {
      throw new Error("Error de metodo getProducts:", {
        cause: "El limite excedió la cantidad de productos",
      });
    }
    const productsFilter = products.slice(0, limit);
    // res.status(200).send({
    //   message: "Solcitud exitosa",
    //   statusCode: 200,
    //   data: productsFilter,
    // });
    res.status(200).render("home", {
      pageTitle: "Home",
      products: productsFilter,
      layout: false,
    });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo getProducts:";
    }
    next(error);
  }
};*/

/*exports.getRealTimeProducts = async (req,res,next) =>{
  const limit = Number(req.query.limit);
  try {
    const products = await alejandroManager.getProducts();
    if (!limit) {
      return res
        .status(200)
        //.send({ message: "Solcitud exitosa", statusCode: 200, data: products });
        .render('realTimeProducts',{
          pageTitle: 'RealTimeProducts',
          products: products,
          layout: false
        })
      }
    if (!(products.length >= limit)) {
      throw new Error("Error de metodo getProducts:", {
        cause: "El limite excedió la cantidad de productos",
      });
    }
    const productsFilter = products.slice(0, limit);
    // res.status(200).send({
    //   message: "Solcitud exitosa",
    //   statusCode: 200,
    //   data: productsFilter,
    // });
    res.status(200).render('home',{
      pageTitle: 'realTimeProducts',
      products: productsFilter,
      layout: false
    })
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo getProducts:";
    }
    next(error);
  }
}*/

/*exports.getProductById = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  try {
    if (isNaN(Number(productId))) {
      product = await alejandroManager.getProductById(productId);
    } else {
      product = await alejandroManager.getProductByAutoId(productId);
    }
    if (!product) {
      const error = new Error("Error de metodo getProductById:", {
        cause: "Producto no encontrado",
      });
      error.statusCode = 404;
      throw error;
    }
    res.send({ message: "Solcitud exitosa", statusCode: 200, data: product });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo getProductById:";
    }
    next(error);
  }
};*/

exports.postProduct = async (req, res, next) => {
  const product = req.body;
  try {
    const newProduct = await alejandroManager.addProduct(product);
    res
      .status(201)
      .send({ message: "Solcitud exitosa", statusCode: 201, data: newProduct });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo postProduct:";
    }
    next(error);
  }
};

exports.putProduct = async (req, res, next) => {
  const productId = req.params.pid;
  const productUpdate = req.body;
  try {
    const updateproduct = await alejandroManager.updateProduct(
      productId,
      productUpdate
    );
    res.status(200).send({
      message: "Solcitud exitosa",
      statusCode: 200,
      data: updateproduct,
    });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo putProduct:";
    }
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;
  try {
    const result = await alejandroManager.deleteProduct(productId);
    res
      .status(200)
      .send({ message: "Solcitud exitosa", statusCode: 200, data: result });
  } catch (error) {
    if (!error.message) {
      error.message = "Error de metodo deleteProduct:";
    }
    next(error);
  }
};
