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
exports.paymentDetailsWithClient = exports.defaultTimeout = void 0;
const format_1 = require("./error/format");
exports.defaultTimeout = 60000;
const paymentDetailsWithClient = httpClient => (config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!config.params)
        throw new format_1.FormatError('"params" is required');
    const { transactionId, orderId } = config.params;
    const noTransactionId = !transactionId || transactionId.length === 0;
    const noOrderId = !orderId || orderId.length === 0;
    if (noTransactionId && noOrderId) {
        throw new format_1.FormatError('transactionId or orderId is required');
    }
    const { data } = yield httpClient.get('/v3/payments', Object.assign(Object.assign({}, config), { timeout: (_a = config.timeout) !== null && _a !== void 0 ? _a : exports.defaultTimeout }));
    return data;
});
exports.paymentDetailsWithClient = paymentDetailsWithClient;
//# sourceMappingURL=payment-details.js.map