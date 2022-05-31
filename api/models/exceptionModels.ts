export class NotAcceptableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NotAcceptableError.prototype);
  }
}

export class ConflictError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
