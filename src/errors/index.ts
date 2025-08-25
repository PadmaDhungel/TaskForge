export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class AuthError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'NotFound Error') {
        super(message, 404)
    }
}
export class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database Error') {
        super(message, 503);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message = 'Service Unavailable') {
        super(message, 503);
    }
}