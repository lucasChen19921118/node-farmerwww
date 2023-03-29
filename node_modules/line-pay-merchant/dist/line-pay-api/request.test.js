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
const request_1 = require("./request");
const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn()
};
describe('request', () => {
    const body = {
        amount: 100,
        currency: 'TWD',
        orderId: 'orderId',
        packages: [
            {
                id: '0',
                amount: 123,
                products: [
                    {
                        id: 'productId',
                        name: 'LINE',
                        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/LINE_New_App_Icon_%282020-12%29.png',
                        quantity: 2,
                        price: 101
                    }
                ]
            }
        ],
        redirectUrls: {
            confirmUrl: 'https://www.google.com',
            cancelUrl: 'https://www.google.com'
        }
    };
    it('should call httpClient.post', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            body
        };
        (0, request_1.requestWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith('/v3/payments/request', body, {
            timeout: 20000
        });
        expect(httpClient.post).toHaveBeenCalledTimes(1);
    }));
    it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
        const httpClient = mockHttpClient;
        mockHttpClient.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
        const req = {
            body,
            timeout: 1000
        };
        (0, request_1.requestWithClient)(httpClient)(req);
        expect(httpClient.post).toHaveBeenCalledWith('/v3/payments/request', body, {
            timeout: 1000
        });
    }));
    it('should throw exception if body does not exist in request config', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const req = {};
        try {
            yield (0, request_1.requestWithClient)(mockHttpClient)(req);
        }
        catch (e) {
            if ((0, format_1.isFormatError)(e)) {
                expect(e).toEqual(new format_1.FormatError('"body" is required'));
            }
        }
    }));
});
//# sourceMappingURL=request.test.js.map