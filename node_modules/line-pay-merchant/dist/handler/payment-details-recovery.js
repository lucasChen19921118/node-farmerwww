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
exports.createPaymentDetailsRecoveryHandler = exports.paymentDetailsToRefund = exports.paymentDetailsToConfirm = void 0;
const payment_details_1 = require("../line-pay-api/payment-details");
const create_1 = require("../payment-api/create");
const line_pay_api_1 = require("../line-pay-api/error/line-pay-api");
const timeout_1 = require("../line-pay-api/error/timeout");
/**
 * Response converter for confirm API. Convert the response body from payment details API to confirm API.
 *
 * @param req original request
 * @param paymentDetails response body from payment details API
 * @returns confirm API response body
 */
function paymentDetailsToConfirm(req, paymentDetails) {
    const { transactionId } = req;
    const info = paymentDetails.info.find(i => i.transactionId === transactionId);
    if (!info)
        throw new Error('Transaction ID not found in payment details');
    return {
        returnCode: paymentDetails.returnCode,
        returnMessage: paymentDetails.returnMessage,
        info
    };
}
exports.paymentDetailsToConfirm = paymentDetailsToConfirm;
/**
 * Response converter for refund API. Convert the response body from payment details API to refund API.
 *
 * @param req original request
 * @param paymentDetails response body from payment details API
 * @returns refund API response body
 */
function paymentDetailsToRefund(req, paymentDetails) {
    const { transactionId } = req;
    const info = paymentDetails.info.find(i => i.transactionId === transactionId);
    if (!info)
        throw new Error('Transaction ID not found in payment details');
    return {
        returnCode: paymentDetails.returnCode,
        returnMessage: paymentDetails.returnMessage,
        info: {
            refundTransactionId: transactionId,
            refundTransactionDate: info.transactionDate
        }
    };
}
exports.paymentDetailsToRefund = paymentDetailsToRefund;
// 1172: There is a record of transaction with the same order number.
// 1198: API call request has been duplicated.
const defaultPredicate = (error) => (0, timeout_1.isTimeoutError)(error) ||
    ((0, line_pay_api_1.isLinePayApiError)(error) &&
        (error.data.returnCode === '1172' || error.data.returnCode === '1198'));
function fix(converter, req, httpClient, error) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paymentDetails = (0, create_1.createPaymentApi)('paymentDetails', payment_details_1.paymentDetailsWithClient, httpClient);
            // Check with payment details API
            const paymentDetailsResponse = yield paymentDetails.send({
                params: {
                    transactionId: [req.transactionId]
                }
            });
            const comments = {};
            if ((0, line_pay_api_1.isLinePayApiError)(error)) {
                comments.originalLinePayApiError = error;
            }
            return {
                body: converter(req, paymentDetailsResponse.body),
                comments
            };
        }
        catch (paymentDetailsError) {
            // Failed to fix. Throw the original exception.
            throw error;
        }
    });
}
/**
 * Create a handler for confirm and refund API. The handler will handle the 1172 and 1198 error and timeout error by calling the payment details API and verify the transaction result.
 *
 * @param converter convert payment details to response body (confirm/refund)
 * @param predicate predicate to determine whether the error should be handled
 * @returns API handler
 */
const createPaymentDetailsRecoveryHandler = (converter, predicate = defaultPredicate) => ({ req, next, httpClient }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield next(req);
    }
    catch (e) {
        if (!predicate(e))
            throw e;
        return fix(converter, req, httpClient, e);
    }
});
exports.createPaymentDetailsRecoveryHandler = createPaymentDetailsRecoveryHandler;
//# sourceMappingURL=payment-details-recovery.js.map