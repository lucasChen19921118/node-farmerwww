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
const format_1 = require("./error/format");
const payment_details_1 = require("./payment-details");
const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn()
};
describe('payment-details', () => {
    const transactionId = '2021113000697317600';
    const params = {
        transactionId: [transactionId]
    };
    it('should call httpClient.get', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.get.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            params
        };
        (0, payment_details_1.paymentDetailsWithClient)(httpClient)(req);
        expect(httpClient.get).toHaveBeenCalledWith('/v3/payments', Object.assign(Object.assign({}, req), { timeout: 60000 }));
        expect(httpClient.get).toHaveBeenCalledTimes(1);
    }));
    it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.get.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            params,
            timeout: 1000
        };
        (0, payment_details_1.paymentDetailsWithClient)(httpClient)(req);
        expect(httpClient.get).toHaveBeenCalledWith('/v3/payments', Object.assign(Object.assign({}, req), { timeout: 1000 }));
    }));
    it('should throw exception if params does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {};
        try {
            yield (0, payment_details_1.paymentDetailsWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"params" is required'));
            }
        }
    }));
    it('should throw exception if both transactionId and orderId do not exist in params', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {
            params: {}
        };
        try {
            yield (0, payment_details_1.paymentDetailsWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('transactionId or orderId is required'));
            }
        }
    }));
    it('should throw exception if both transactionId and orderId have length 0', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {
            params: {
                transactionId: [],
                orderId: []
            }
        };
        try {
            yield (0, payment_details_1.paymentDetailsWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('transactionId or orderId is required'));
            }
        }
    }));
});
//# sourceMappingURL=payment-details.test.js.map