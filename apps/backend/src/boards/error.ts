export class BoardNotFoundError extends Error {
  constructor(message = "Board not found") {
    super(message);
    this.name = "BoardNotFoundError";
  }
}

export class NoValidFieldsError extends Error {
  constructor(message = "No valid fields to update") {
    super(message);
    this.name = "NoValidFieldsError";
  }
}

export class DuplicateSlugError extends Error {
  constructor(message = "A board with this slug already exists") {
    super(message);
    this.name = "DuplicateSlugError";
  }
}

export class InvalidOwnerError extends Error {
  constructor(message = "Invalid owner specified") {
    super(message);
    this.name = "InvalidOwnerError";
  }
}
