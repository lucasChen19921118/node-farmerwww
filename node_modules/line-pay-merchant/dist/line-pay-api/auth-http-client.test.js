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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_http_client_1 = require("./auth-http-client");
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const line_pay_api_1 = require("./error/line-pay-api");
const timeout_1 = require("./error/timeout");
const http_1 = require("./error/http");
const mockedUuid = '00000000-0000-0000-0000-000000000000';
jest.mock('uuid', () => ({ v4: () => mockedUuid }));
describe('auth-http-client', () => {
    describe('paramsSerializer', () => {
        it('should convert query object with primitive value to query string', () => {
            const queryString = (0, auth_http_client_1.paramsSerializer)({
                orderId: '20211216004',
                amount: 100,
                sandbox: false
            });
            expect(queryString).toBe('orderId=20211216004&amount=100&sandbox=false');
        });
        it('should convert query object with array of string value to query string', () => {
            const queryString = (0, auth_http_client_1.paramsSerializer)({
                orderId: '20211216004',
                transactionId: ['2021113000697317600']
            });
            expect(queryString).toBe('orderId=20211216004&transactionId=2021113000697317600');
        });
    });
    describe('httpClient', () => {
        const merchantConfig = {
            channelId: 'channelId',
            channelSecretKey: 'channelSecretKey',
            env: 'development'
        };
        const url = 'https://sandbox-api-pay.line.me/v3/payments';
        const transactionId = '2021113000697317600';
        it('should send to production server if env is set to production', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const merchantConfig = {
                channelId: 'channelId',
                channelSecretKey: 'channelSecretKey',
                env: 'production'
            };
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const mockResult = {
                returnCode: '0000',
                returnMessage: 'Success.'
            };
            mock.onPost(/.*/).reply(200, JSON.stringify(mockResult));
            const res = yield httpClient.post(url);
            expect(res.config.baseURL).toBe('https://api-pay.line.me');
        }));
        it('should send to sandbox server if env is set to development', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const merchantConfig = {
                channelId: 'channelId',
                channelSecretKey: 'channelSecretKey',
                env: 'development'
            };
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const mockResult = {
                returnCode: '0000',
                returnMessage: 'Success.'
            };
            mock.onPost(/.*/).reply(200, JSON.stringify(mockResult));
            const res = yield httpClient.post(url);
            expect(res.config.baseURL).toBe('https://sandbox-api-pay.line.me');
        }));
        it('should throw exception if returnCode is not a 4-digit number', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const mockResult = {
                returnCode: '000',
                returnMessage: 'Success.'
            };
            mock.onPost(/.*/).reply(200, JSON.stringify(mockResult));
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                expect(e).toEqual(new Error('Length of returnCode should be 4'));
            }
        }));
        it('should throw exception if the result is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            mock.onPost(/.*/).reply(200, undefined);
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                expect(e).toEqual(new Error('Empty result'));
            }
        }));
        it('should throw exception if the result format is not JSON string', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            mock.onPost(/.*/).reply(200, 123);
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                expect(e instanceof Error).toBe(true);
            }
        }));
        it('should throw exception if returnCode is not begin with 0', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(3);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const mockResult = {
                returnCode: '2101',
                returnMessage: 'A parameter error'
            };
            const error = new line_pay_api_1.LinePayApiError(mockResult.returnMessage, 200, mockResult);
            mock.onPost(/.*/).reply(200, JSON.stringify(mockResult));
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                if ((0, line_pay_api_1.isLinePayApiError)(e)) {
                    expect(e).toEqual(error);
                    expect(e.statusCode).toBe(error.statusCode);
                    expect(e.data).toEqual(error.data);
                }
            }
        }));
        it('should throw exception if an API times out', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const error = new timeout_1.TimeoutError('timeout of 20000ms exceeded');
            mock.onPost(/.*/).timeout();
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                if ((0, timeout_1.isTimeoutError)(e)) {
                    expect(e).toEqual(error);
                }
            }
        }));
        it('should replace default timeout with timeout in config', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const merchantConfig = {
                channelId: 'channelId',
                channelSecretKey: 'channelSecretKey',
                timeout: 10000,
                env: 'development'
            };
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const error = new timeout_1.TimeoutError('timeout of 10000ms exceeded');
            mock.onPost(/.*/).timeout();
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                if ((0, timeout_1.isTimeoutError)(e)) {
                    expect(e).toEqual(error);
                }
            }
        }));
        it('should throw exception if it encounters an HTTP error', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(3);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const mockResult = {
                msg: 'some error message'
            };
            const error = new http_1.HttpError('Request failed with status code 500', 500, mockResult);
            mock.onPost(/.*/).reply(500, JSON.stringify(mockResult));
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                if ((0, http_1.isHttpError)(e)) {
                    expect(e).toEqual(error);
                    expect(e.statusCode).toBe(error.statusCode);
                    expect(e.data).toEqual(error.data);
                }
            }
        }));
        it('should throw exception if it encounters an network error', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
            const mock = new axios_mock_adapter_1.default(httpClient);
            const error = new Error('Network Error');
            mock.onPost(/.*/).networkError();
            try {
                yield httpClient.post(url);
            }
            catch (e) {
                expect(e).toEqual(error);
            }
        }));
        it('should convert all transactionIds in result to string', () => __awaiter(void 0, void 0, void 0, function* () {
            const testCases = [
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":2021113000697317610}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":"2021113000697317610"}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId": 2021113000697317610}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":"2021113000697317610"}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":2021113000697317610,"n2":123}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":"2021113000697317610","n2":123}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":2021113000697317610, "n2": 123}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":"2021113000697317610","n2":123}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":2021113000697317610, "n2": 123}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"transactionId":"2021113000697317610","n2":123}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","transactionId":2021113000697317610,"info":{"transactionId":2021113000697317610}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","transactionId":"2021113000697317610","info":{"transactionId":"2021113000697317610"}}')
                }
            ];
            expect.assertions(testCases.length);
            yield Promise.all(testCases.map(({ resultString, expected }) => __awaiter(void 0, void 0, void 0, function* () {
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                mock.onGet(/.*/).reply(200, resultString);
                const res = yield httpClient.get(url);
                expect(res.data).toEqual(expected);
            })));
        }));
        it('should convert all refundTransactionIds in result to string', () => __awaiter(void 0, void 0, void 0, function* () {
            const testCases = [
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":2021113000697317610}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":"2021113000697317610"}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId": 2021113000697317610}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":"2021113000697317610"}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":2021113000697317610,"n2":123}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":"2021113000697317610","n2":123}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":2021113000697317610, "n2": 123}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":"2021113000697317610","n2":123}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":2021113000697317610, "n2": 123}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","info":{"refundTransactionId":"2021113000697317610","n2":123}}')
                },
                {
                    resultString: '{"returnCode":"0000","returnMessage":"Success.","refundTransactionId":2021113000697317610,"info":{"refundTransactionId":2021113000697317610}}',
                    expected: JSON.parse('{"returnCode":"0000","returnMessage":"Success.","refundTransactionId":"2021113000697317610","info":{"refundTransactionId":"2021113000697317610"}}')
                }
            ];
            expect.assertions(testCases.length);
            yield Promise.all(testCases.map(({ resultString, expected }) => __awaiter(void 0, void 0, void 0, function* () {
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                mock.onGet(/.*/).reply(200, resultString);
                const res = yield httpClient.get(url);
                expect(res.data).toEqual(expected);
            })));
        }));
        describe('get()', () => {
            it('should return correct result', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                const mockResult = {
                    returnCode: '0000',
                    returnMessage: 'Success.'
                };
                mock.onGet(/.*/).reply(200, JSON.stringify(mockResult));
                const res = yield httpClient.get(url);
                expect(res.data).toEqual(mockResult);
            }));
            it('should set correct headers', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                const header = {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelId': merchantConfig.channelId,
                    'X-LINE-Authorization-Nonce': mockedUuid,
                    'X-LINE-Authorization': 'CcToW3HaslH44yvJNliuomtkwufd8aC048p3QXZPlj8='
                };
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                const mockResult = {
                    returnCode: '0000',
                    returnMessage: 'Success.'
                };
                mock.onGet(/.*/).reply(200, JSON.stringify(mockResult));
                const res = yield httpClient.get(url, {
                    params: { transactionId }
                });
                expect(res.config.headers).toEqual(header);
            }));
        });
        describe('post()', () => {
            it('should return correct result', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                const mockResult = {
                    returnCode: '0000',
                    returnMessage: 'Success.'
                };
                mock.onPost(/.*/).reply(200, JSON.stringify(mockResult));
                const res = yield httpClient.post(url);
                expect(res.data).toEqual(mockResult);
            }));
            it('should set correct headers', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                const header = {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelId': merchantConfig.channelId,
                    'X-LINE-Authorization-Nonce': mockedUuid,
                    'X-LINE-Authorization': 'En0nRkzzQpXrXo6OHNV+827g+rWIwUq5VTk/n9Jm5Ek='
                };
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                const mockResult = {
                    returnCode: '0000',
                    returnMessage: 'Success.'
                };
                mock.onPost(/.*/).reply(200, JSON.stringify(mockResult));
                const res = yield httpClient.post(url, {
                    transactionId
                });
                expect(res.config.headers).toEqual(header);
            }));
        });
        describe('put()', () => {
            it('should not set headers', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                const header = {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                };
                const httpClient = (0, auth_http_client_1.createAuthHttpClient)(merchantConfig);
                const mock = new axios_mock_adapter_1.default(httpClient);
                const mockResult = {
                    returnCode: '0000',
                    returnMessage: 'Success.'
                };
                mock.onPut(/.*/).reply(200, JSON.stringify(mockResult));
                const res = yield httpClient.put(url, {
                    transactionId
                });
                expect(res.config.headers).toEqual(header);
            }));
        });
    });
});
//# sourceMappingURL=auth-http-client.test.js.map