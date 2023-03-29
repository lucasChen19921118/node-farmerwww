"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimeoutError = exports.TimeoutError = void 0;
class TimeoutError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.TimeoutError = TimeoutError;
function isTimeoutError(error) {
    return error instanceof TimeoutError;
}
exports.isTimeoutError = isTimeoutError;
//# sourceMappingURL=timeout.js.map