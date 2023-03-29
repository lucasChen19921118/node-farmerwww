"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFormatError = exports.FormatError = void 0;
class FormatError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.FormatError = FormatError;
function isFormatError(error) {
    return error instanceof FormatError;
}
exports.isFormatError = isFormatError;
//# sourceMappingURL=format.js.map