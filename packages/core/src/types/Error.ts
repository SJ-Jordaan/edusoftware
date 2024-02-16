/**
 * Base class for all custom application errors, capturing the HTTP status code and an error message.
 */
export class ApplicationError extends Error {
  statusCode: number;

  /**
   * Constructs a new ApplicationError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code corresponding to the error.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error class representing a "Not Found" error, typically used when a requested resource cannot be found.
 */
export class NotFoundError extends ApplicationError {
  /**
   * Constructs a new NotFoundError.
   * @param {string} resource - The name of the resource that was not found.
   */
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

/**
 * Error class representing a Bad Request error. This error should be thrown when
 * the client submits a request that doesn't conform to the expected format or
 * is missing required information.
 */
export class BadRequestError extends ApplicationError {
  /**
   * Constructs a new BadRequestError.
   * @param {string} message - A message describing why the request is malformed.
   */
  constructor(message: string) {
    super(`Bad request: ${message}`, 400);
  }
}
