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
const void_1 = require("./void");
const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn()
};
describe('void', () => {
    const body = {};
    it('should call httpClient.post', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const transactionId = '2021113000697317600';
        const req = {
            transactionId,
            body
        };
        (0, void_1.voidWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith(`/v3/payments/authorizations/${transactionId}/void`, body, {
            timeout: 20000
        });
        expect(httpClient.post).toHaveBeenCalledTimes(1);
    }));
    it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const transactionId = '2021113000697317600';
        const req = {
            transactionId,
            body,
            timeout: 1000
        };
        (0, void_1.voidWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith(`/v3/payments/authorizations/${transactionId}/void`, body, {
            timeout: 1000
        });
    }));
    it('should throw exception if transactionId does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {};
        try {
            yield (0, void_1.voidWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"transactionId" is required'));
            }
        }
    }));
});
//# sourceMappingURL=void.test.js.map