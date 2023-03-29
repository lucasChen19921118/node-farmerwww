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
const expire_regkey_1 = require("./expire-regkey");
const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn()
};
describe('expireRegKey', () => {
    const body = {};
    it('should call httpClient.post', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const regKey = 'RK9D2BA19XTFQWC';
        const req = {
            regKey,
            body
        };
        (0, expire_regkey_1.expireRegKeyWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith(`/v3/payments/preapprovedPay/${regKey}/expire`, body, {
            timeout: 20000
        });
        expect(httpClient.post).toHaveBeenCalledTimes(1);
    }));
    it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const regKey = 'RK9D2BA19XTFQWC';
        const req = {
            regKey,
            body,
            timeout: 1000
        };
        (0, expire_regkey_1.expireRegKeyWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith(`/v3/payments/preapprovedPay/${regKey}/expire`, body, {
            timeout: 1000
        });
    }));
    it('should throw exception if regKey does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {};
        try {
            yield (0, expire_regkey_1.expireRegKeyWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"regKey" is required'));
            }
        }
    }));
});
//# sourceMappingURL=expire-regkey.test.js.map