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
exports.checkPaymentStatusWithClient = exports.defaultTimeout = void 0;
const format_1 = require("./error/format");
exports.defaultTimeout = 20000;
const checkPaymentStatusWithClient = httpClient => {
    return ({ transactionId, params, timeout }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!params)
            throw new format_1.FormatError('"params" is required');
        if (!transactionId)
            throw new format_1.FormatError('"transactionId" is required');
        const { data } = yield httpClient.get(`/v3/payments/requests/${transactionId}/check`, {
            params,
            timeout: timeout !== null && timeout !== void 0 ? timeout : exports.defaultTimeout
        });
        return data;
    });
};
exports.checkPaymentStatusWithClient = checkPaymentStatusWithClient;
//# sourceMappingURL=check-payment-status.js.map