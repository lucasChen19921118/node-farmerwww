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
const pay_preapproved_1 = require("./pay-preapproved");
const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn()
};
describe('payPreapproved', () => {
    const body = {
        productName: 'Demo Product',
        amount: 100,
        currency: 'TWD',
        orderId: '20211221001'
    };
    const regKey = 'RK9D2BA19XTFQWC';
    it('should call httpClient.post', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            regKey,
            body
        };
        (0, pay_preapproved_1.payPreapprovedWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith(`/v3/payments/preapprovedPay/${regKey}/payment`, body, {
            timeout: 40000
        });
        expect(httpClient.post).toHaveBeenCalledTimes(1);
    }));
    it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            regKey,
            body,
            timeout: 1000
        };
        (0, pay_preapproved_1.payPreapprovedWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith(`/v3/payments/preapprovedPay/${regKey}/payment`, body, {
            timeout: 1000
        });
    }));
    it('should throw exception if regKey does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {
            body
        };
        try {
            yield (0, pay_preapproved_1.payPreapprovedWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"regKey" is required'));
            }
        }
    }));
    it('should throw exception if body does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {
            regKey
        };
        try {
            yield (0, pay_preapproved_1.payPreapprovedWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"body" is required'));
            }
        }
    }));
});
//# sourceMappingURL=pay-preapproved.test.js.map