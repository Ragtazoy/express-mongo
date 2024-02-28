class AppError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static BadRequest(message) {
    return new AppError(400, message);
  }

  static Unauthorized(message) {
    return new AppError(401, message);
  }

  static NotFound(message) {
    return new AppError(404, message);
  }

  static Internal(message) {
    return new AppError(500, message);
  }
}

function castErrorHandler(err) {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return AppError.BadRequest(msg);
}

function duplicateKeyErrorHandler(err) {
  const key = Object.keys(err.keyValue);
  const msg = `${key} already exists`;

  return AppError.BadRequest(msg);
}

function validationErrorHandler(err) {
  const errors = Object.values(err.errors).map((val) => {
    if (val.name === "CastError") {
      return `Invalid value for ${val.path}: ${val.value}.`;
    }
    return `Invalid input data: ${val.message}`;
  });
  const msg = errors.join(", ");

  return AppError.BadRequest(msg);
}

function ErrorHandler(error, req, res, next) {
  if (error.name === "CastError") error = castErrorHandler(error);
  if (error.code === 11000) error = duplicateKeyErrorHandler(error);
  if (error.name === "ValidationError") error = validationErrorHandler(error);

  if (error instanceof AppError) {
    res.status(error.status);
    res.send({
      status: error.status,
      error: true,
      message: error.message,
    });
  }

  res.status(500).send({
    status: error.status || 500,
    error: true,
    message: error || "Something went wrong.",
  });
}

module.exports = { AppError, ErrorHandler };
