// MOST Web Framework Codename Zero Gravity Copyright (c) 2017-2022, THEMOST LP All rights reserved

import { Errors as errors } from './http-error-codes';

interface IHttpErrorCode {
    title: string;
    status: number;
    message: string;
}
interface IStatusError {
    statusCode: number;
}
interface ICodeError {
    code: string;
}

/**
 * @classdesc Thrown when an application tries to call an abstract method.
 */
class AbstractMethodError extends Error {
    constructor(msg?: string) {
        super(msg);
        this.message = msg || 'Class does not implement inherited abstract method.';
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * @classdesc Thrown when an application tries to instantiate an abstract class.
 * @class
 * @param {string=} msg
 * @constructor
 * @extends Error
 */
class AbstractClassError extends Error {
    constructor(msg?: string) {
        super(msg);
        this.message = msg || 'An abstract class cannot be instantiated.';
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * @classdesc Represents an error with a code.
 */
class CodedError extends Error {
    code: string;
    constructor(msg: string, code: string) {
        super(msg);
        this.message = msg;
        this.code = code;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * @classdesc Thrown when an application tries to access a file which does not exist.
 */
class FileNotFoundError extends CodedError {
    constructor(msg: string) {
        super(msg, 'E_FOUND')
    }
}

/**
 * @classdesc Represents an HTTP error.
 */
class HttpError extends CodedError {
    title: string;
    statusCode: any;
    innerMessage: string;
    constructor(status: number, message?: string, innerMessage?: string) {
        super(message, 'E_HTTP');
        const finalStatus = typeof status === 'number' ? status : 500;
        const err = errors.find((x) => {
            return x.statusCode === finalStatus;
        });
        if (err) {
            this.title = err.title;
            this.message = message || err.message;
            this.statusCode = err.statusCode;
        }
        else {
            this.title = 'Internal Server Error';
            this.message = message || 'The server encountered an internal error and was unable to complete the request.';
            this.statusCode = finalStatus;
        }
        if (typeof innerMessage !== 'undefined') {
            this.innerMessage = innerMessage;
        }
    }
    /**
     * @param {Error|HttpError} err
     * @returns {Error|HttpError}
     */
    static create(err: HttpError | Error) {
        if (err == null) {
            return new HttpError(500);
        }
        if (Object.prototype.hasOwnProperty.call(err, 'statusCode')) {
            return Object.assign(new HttpError((err as IStatusError).statusCode, err.message), err);
        }
        else {
            return Object.assign(new HttpError(500, err.message), err);
        }
    }
}

/**
 * @classdesc Represents a 400 HTTP Bad Request error.
 */
class HttpBadRequestError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(400, message, innerMessage);
    }
}

/**
 * @classdesc Represents a 404 HTTP Not Found error.
 */
class HttpNotFoundError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(400, message, innerMessage);
    }
}


/**
 * @classdesc Represents a 405 HTTP Method Not Allowed error.
 */
class HttpMethodNotAllowedError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(405, message, innerMessage);
    }
}

/**
 * @classdesc Represents a 401 HTTP Unauthorized error.
 */
class HttpUnauthorizedError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(401, message, innerMessage);
    }
}

/**
 * @classdesc HTTP 406 Not Acceptable exception class
 */
class HttpNotAcceptableError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(406, message, innerMessage);
    }
}

/**
 * @classdesc HTTP 408 RequestTimeout exception class
 */
class HttpRequestTimeoutError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(408, message, innerMessage);
    }
}


/**
 * @classdesc HTTP 409 Conflict exception class
 */
class HttpConflictError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(409, message, innerMessage);
    }
}

/**
 * @classdesc HTTP 498 Token Expired exception class
 */
class HttpTokenExpiredError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(498, message, innerMessage);
    }
}

/**
 * @classdesc HTTP 499 Token Required exception class
 */
class HttpTokenRequiredError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(499, message, innerMessage);
    }
}


/**
 * @classdesc Represents a 403 HTTP Forbidden error.
 */
class HttpForbiddenError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(499, message, innerMessage);
    }
}

/**
 * @classdesc Represents a 500 HTTP Internal Server error.
 */
class HttpServerError extends HttpError {
    constructor(message?: string, innerMessage?: string) {
        super(500, message, innerMessage);
    }
}

/**
 * @classdesc Extends Error object for throwing exceptions on data operations
 */
class DataError extends CodedError {
    model: string;
    field: string;
    innerMessage: string;
    additionalData: any;
    statusCode: any;
    /**
     * @param {string=} code - The error code
     * @param {string} message - The error message
     * @param {string=} innerMessage - The error inner message
     * @param {string=} model - The target model
     * @param {string=} field - The target field
     * @param {*=} additionalData - Error additional data
     */
    constructor(code: string, message?: string, innerMessage?: string, model?: string, field?: string, additionalData?: any) {
        super(message, code);
        this.code = code || 'E_DATA';
        if (typeof model !== 'undefined') {
            this.model = model;
        }
        if (typeof field !== 'undefined') {
            this.field = field;
        }
        this.message = message || 'A general data error occurred.';
        if (typeof innerMessage !== 'undefined') {
            this.innerMessage = innerMessage;
        }
        this.additionalData = additionalData;
    }
}

/**
 * Thrown when an application attempts to access a data object that cannot be found.
 */
class NotNullError extends DataError {
    constructor(message?: string, innerMessage?: string, model?: string, field?: string, additionalData?: any) {
        super('E_NULL', message || 'A value is required.', innerMessage, model, field, additionalData);
        this.statusCode = 409;
    }
}

/**
 * Thrown when an application attempts to access a data object that cannot be found.
 * @param {string=} message - The error message
 * @param {string=} innerMessage - The error inner message
 * @param {string=} model - The target model
 * @constructor
 * @extends DataError
 */
class DataNotFoundError extends DataError {
    constructor(message?: string, innerMessage?: string, model?: string) {
        super('E_FOUND', message || 'The requested data was not found.', innerMessage, model);
        this.statusCode = 404;
    }
}

/**
 * Thrown when a data object operation is denied
 */
class AccessDeniedError extends DataError {
    constructor(message?: string, innerMessage?: string, model?: string) {
        super('E_ACCESS', ('Access Denied' || message), innerMessage, model);
        this.statusCode = 401;
    }
}

/**
 * Thrown when a unique constraint is being violated
 */
class UniqueConstraintError extends DataError {
    constructor(message?: string, innerMessage?: string, model?: string) {
        super('E_UNIQUE', message || 'A unique constraint violated', innerMessage, model);
        this.statusCode = 409;
    }
}

export {
    ICodeError,
    IStatusError,
    IHttpErrorCode,
    AbstractMethodError,
    AbstractClassError,
    FileNotFoundError,
    HttpError,
    HttpBadRequestError,
    HttpNotFoundError,
    HttpMethodNotAllowedError,
    HttpNotAcceptableError,
    HttpConflictError,
    HttpRequestTimeoutError,
    HttpTokenExpiredError,
    HttpTokenRequiredError,
    HttpUnauthorizedError,
    HttpForbiddenError,
    HttpServerError,
    DataError,
    DataNotFoundError,
    NotNullError,
    AccessDeniedError,
    UniqueConstraintError
}
