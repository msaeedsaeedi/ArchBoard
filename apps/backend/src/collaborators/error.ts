export class CollaboratorsNotFoundError extends Error {
  constructor(message = "No collaborators found for this board.") {
    super(message);
    this.name = "CollaboratorsNotFoundError";
  }
}

export class CollaboratorNotFoundError extends Error {
  constructor(message = "Collaborator not found.") {
    super(message);
    this.name = "CollaboratorNotFoundError";
  }
}

export class CollaboratorAlreadyExistsError extends Error {
  constructor(message = "User is already a collaborator on this board.") {
    super(message);
    this.name = "CollaboratorAlreadyExistsError";
  }
}

export class InsufficientPermissionsError extends Error {
  constructor(message = "Only the board owner can perform this action.") {
    super(message);
    this.name = "InsufficientPermissionsError";
  }
}

export class CannotRemoveOwnerError extends Error {
  constructor(message = "Cannot remove the board owner as a collaborator.") {
    super(message);
    this.name = "CannotRemoveOwnerError";
  }
}
