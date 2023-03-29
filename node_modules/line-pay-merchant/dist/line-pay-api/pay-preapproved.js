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
exports.payPreapprovedWithClient = exports.defaultTimeout = void 0;
const format_1 = require("./error/format");
exports.defaultTimeout = 40000;
const payPreapprovedWithClient = httpClient => ({ regKey, body, timeout }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!regKey)
        throw new format_1.FormatError('"regKey" is required');
    if (!body)
        throw new format_1.FormatError('"body" is required');
    const { data } = yield httpClient.post(`/v3/payments/preapprovedPay/${regKey}/payment`, body, {
        timeout: timeout !== null && timeout !== void 0 ? timeout : exports.defaultTimeout
    });
    return data;
});
exports.payPreapprovedWithClient = payPreapprovedWithClient;
//# sourceMappingURL=pay-preapproved.js.map