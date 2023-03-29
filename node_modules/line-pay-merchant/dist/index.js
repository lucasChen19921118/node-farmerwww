"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinePayClient = exports.isTimeoutError = exports.TimeoutError = exports.isLinePayApiError = exports.LinePayApiError = exports.isHttpError = exports.HttpError = exports.createTimeoutRetryHandler = exports.paymentDetailsToRefund = exports.paymentDetailsToConfirm = exports.createPaymentDetailsRecoveryHandler = void 0;
const auth_http_client_1 = require("./line-pay-api/auth-http-client");
const confirm_1 = require("./line-pay-api/confirm");
const refund_1 = require("./line-pay-api/refund");
const request_1 = require("./line-pay-api/request");
const create_1 = require("./payment-api/create");
const payment_details_1 = require("./line-pay-api/payment-details");
var payment_details_recovery_1 = require("./handler/payment-details-recovery");
Object.defineProperty(exports, "createPaymentDetailsRecoveryHandler", { enumerable: true, get: function () { return payment_details_recovery_1.createPaymentDetailsRecoveryHandler; } });
Object.defineProperty(exports, "paymentDetailsToConfirm", { enumerable: true, get: function () { return payment_details_recovery_1.paymentDetailsToConfirm; } });
Object.defineProperty(exports, "paymentDetailsToRefund", { enumerable: true, get: function () { return payment_details_recovery_1.paymentDetailsToRefund; } });
var timeout_retry_1 = require("./handler/timeout-retry");
Object.defineProperty(exports, "createTimeoutRetryHandler", { enumerable: true, get: function () { return timeout_retry_1.createTimeoutRetryHandler; } });
const capture_1 = require("./line-pay-api/capture");
var http_1 = require("./line-pay-api/error/http");
Object.defineProperty(exports, "HttpError", { enumerable: true, get: function () { return http_1.HttpError; } });
Object.defineProperty(exports, "isHttpError", { enumerable: true, get: function () { return http_1.isHttpError; } });
var line_pay_api_1 = require("./line-pay-api/error/line-pay-api");
Object.defineProperty(exports, "LinePayApiError", { enumerable: true, get: function () { return line_pay_api_1.LinePayApiError; } });
Object.defineProperty(exports, "isLinePayApiError", { enumerable: true, get: function () { return line_pay_api_1.isLinePayApiError; } });
var timeout_1 = require("./line-pay-api/error/timeout");
Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: function () { return timeout_1.TimeoutError; } });
Object.defineProperty(exports, "isTimeoutError", { enumerable: true, get: function () { return timeout_1.isTimeoutError; } });
const check_payment_status_1 = require("./line-pay-api/check-payment-status");
const pay_preapproved_1 = require("./line-pay-api/pay-preapproved");
const check_regkey_1 = require("./line-pay-api/check-regkey");
const expire_regkey_1 = require("./line-pay-api/expire-regkey");
const void_1 = require("./line-pay-api/void");
/**
 * Create a client for LINE Pay API.
 *
 * @param config Configuration from the LINE Pay for the client
 * @returns LINE Pay client
 */
function createLinePayClient(config) {
    const httpClient = (0, auth_http_client_1.createAuthHttpClient)(config);
    return {
        request: (0, create_1.createPaymentApi)('request', request_1.requestWithClient, httpClient),
        confirm: (0, create_1.createPaymentApi)('confirm', confirm_1.confirmWithClient, httpClient),
        capture: (0, create_1.createPaymentApi)('capture', capture_1.captureWithClient, httpClient),
        void: (0, create_1.createPaymentApi)('void', void_1.voidWithClient, httpClient),
        refund: (0, create_1.createPaymentApi)('refund', refund_1.refundWithClient, httpClient),
        paymentDetails: (0, create_1.createPaymentApi)('paymentDetails', payment_details_1.paymentDetailsWithClient, httpClient),
        checkPaymentStatus: (0, create_1.createPaymentApi)('checkPaymentStatus', check_payment_status_1.checkPaymentStatusWithClient, httpClient),
        checkRegKey: (0, create_1.createPaymentApi)('checkRegKey', check_regkey_1.checkRegKeyWithClient, httpClient),
        payPreapproved: (0, create_1.createPaymentApi)('payPreapproved', pay_preapproved_1.payPreapprovedWithClient, httpClient),
        expireRegKey: (0, create_1.createPaymentApi)('expireRegKey', expire_regkey_1.expireRegKeyWithClient, httpClient)
    };
}
exports.createLinePayClient = createLinePayClient;
//# sourceMappingURL=index.js.map