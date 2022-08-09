const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    return sendErrorForDev(err, res);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

module.exports = globalError;
