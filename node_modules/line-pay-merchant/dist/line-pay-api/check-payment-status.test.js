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
const check_payment_status_1 = require("./check-payment-status");
const format_1 = require("./error/format");
const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn()
};
describe('check-payment-status', () => {
    const transactionId = '2021113000697317600';
    const params = {};
    it('should call httpClient.get', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.get.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            transactionId: transactionId,
            params
        };
        (0, check_payment_status_1.checkPaymentStatusWithClient)(httpClient)(req);
        expect(httpClient.get).toHaveBeenCalledWith(`/v3/payments/requests/${transactionId}/check`, {
            params,
            timeout: 20000
        });
        expect(httpClient.get).toHaveBeenCalledTimes(1);
    }));
    it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.get.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            transactionId: transactionId,
            params,
            timeout: 1000
        };
        (0, check_payment_status_1.checkPaymentStatusWithClient)(httpClient)(req);
        expect(httpClient.get).toHaveBeenCalledWith(`/v3/payments/requests/${transactionId}/check`, {
            params,
            timeout: 1000
        });
    }));
    it('should throw exception if transactionId does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {
            params
        };
        try {
            yield (0, check_payment_status_1.checkPaymentStatusWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"transactionId" is required'));
            }
        }
    }));
    it('should throw exception if params does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {
            transactionId
        };
        try {
            yield (0, check_payment_status_1.checkPaymentStatusWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"params" is required'));
            }
        }
    }));
});
//# sourceMappingURL=check-payment-status.test.js.map