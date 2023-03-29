"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLinePayApiError = exports.LinePayApiError = void 0;
class LinePayApiError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
exports.LinePayApiError = LinePayApiError;
function isLinePayApiError(error) {
    return error instanceof LinePayApiError;
}
exports.isLinePayApiError = isLinePayApiError;
//# sourceMappingURL=line-pay-api.js.map