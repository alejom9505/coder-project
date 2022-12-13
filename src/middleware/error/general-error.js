module.exports = (error, req, res, next) => {
  console.log(`${error}, Cause: ${error.cause}`);
  console.log(error.stack.replace(/.+\n/gi, ""));
  error.statusCode ? "" : (error.statusCode = 500);
  res.status(error.statusCode).send({
    message: error.message,
    origin: error.origin,
    status: error.statusCode,
    cause: error.cause,
    data: error.data,
  });
};
