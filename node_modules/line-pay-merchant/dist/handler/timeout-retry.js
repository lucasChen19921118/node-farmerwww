"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeoutRetryHandler = void 0;
const timeout_1 = require("../line-pay-api/error/timeout");
/**
 * Create a handler that retries the request if it fails with a timeout error.
 *
 * Example:
 * ```ts
 * const maxRetry = 10 // will send maximum 11 times (10 retry + 1 initial request)
 * const retryTimeout = 5000 // retry after 5 seconds (after request failed)
 * handlers.createTimeoutRetryHandler(maxRetry, retryTimeout)
 * ```
 *
 * @param maxRetry maximum number of retries
 * @param retryTimeout milliseconds to wait before retrying
 * @returns a handler that retries the request if it fails with a timeout error
 */
const createTimeoutRetryHandler = (maxRetry = 10, retryTimeout = 5000) => ({ req, next }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        function f(count = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    resolve(yield next(req));
                }
                catch (e) {
                    if ((0, timeout_1.isTimeoutError)(e) && count < maxRetry)
                        setTimeout(() => f(count + 1), retryTimeout);
                    else
                        reject(e);
                }
            });
        }
        f();
    });
});
exports.createTimeoutRetryHandler = createTimeoutRetryHandler;
//# sourceMappingURL=timeout-retry.js.map