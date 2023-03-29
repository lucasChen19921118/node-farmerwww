"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
exports.HttpError = HttpError;
function isHttpError(error) {
    return error instanceof HttpError;
}
exports.isHttpError = isHttpError;
//# sourceMappingURL=http.js.map