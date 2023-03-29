"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthHttpClient = exports.paramsSerializer = void 0;
const axios_1 = __importDefault(require("axios"));
const hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const uuid_1 = require("uuid");
const timeout_1 = require("./error/timeout");
const http_1 = require("./error/http");
const line_pay_api_1 = require("./error/line-pay-api");
/**
 * convert query object to query string
 *
 * @param params query string object
 * @returns query string
 */
function paramsSerializer(params) {
    return Object.entries(params)
        .map(p => p
        .map(v => v.toString())
        .map(encodeURIComponent)
        .join('='))
        .join('&');
}
exports.paramsSerializer = paramsSerializer;
function encrypt(data, secretKey) {
    const hmac = (0, hmac_sha256_1.default)(data, secretKey);
    return enc_base64_1.default.stringify(hmac);
}
function generateHeader(channelId, nonce, signature) {
    return {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': channelId,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': signature
    };
}
/**
 * Implement LINE Pay API GET Authentication specification
 * Signature = Base64(HMAC-SHA256(Your ChannelSecret, (Your ChannelSecret + URL Path + Query String + nonce)))\
 * Query String : A query string except ? (Example: Name1=Value1&Name2=Value2...)
 */
function handleGetRequest(merchantConfig, config) {
    const nonce = (0, uuid_1.v4)();
    const queryString = paramsSerializer(Object.assign({}, config.params));
    const text = `${merchantConfig.channelSecretKey}${config.url}${queryString}${nonce}`;
    const signature = encrypt(text, merchantConfig.channelSecretKey);
    const headers = generateHeader(merchantConfig.channelId, nonce, signature);
    return Object.assign(Object.assign({}, config), { headers });
}
/**
 * Implement LINE Pay API POST Authentication specification
 * Signature = Base64(HMAC-SHA256(Your ChannelSecret, (Your ChannelSecret + URL Path + RequestBody + nonce)))
 */
function handlePostRequest(merchantConfig, config) {
    const nonce = (0, uuid_1.v4)();
    const dataString = JSON.stringify(config.data);
    const text = `${merchantConfig.channelSecretKey}${config.url}${dataString}${nonce}`;
    const signature = encrypt(text, merchantConfig.channelSecretKey);
    const headers = generateHeader(merchantConfig.channelId, nonce, signature);
    return Object.assign(Object.assign({}, config), { headers });
}
function createAuthHttpClient(merchantConfig) {
    var _a;
    const PRODUCTION_URL = 'https://api-pay.line.me';
    const SANDBOX_URL = 'https://sandbox-api-pay.line.me';
    const BASE_URL = merchantConfig.env === 'production' ? PRODUCTION_URL : SANDBOX_URL;
    /**
     * JavaScript numbers are double-precision floating-point.
     * Transaction ID is larger than the largest integer JavaScript can be precisely stored (which is 2^53, 9007199254740992).
     * So we should convert the number to string.
     */
    const transformResponse = data => typeof data !== 'string'
        ? data
        : JSON.parse(data
            .replace(/"transactionId":\s*(\d+)/g, '"transactionId":"$1"')
            .replace(/"refundTransactionId":\s*(\d+)/g, '"refundTransactionId":"$1"'));
    const axiosInstance = axios_1.default.create({
        baseURL: BASE_URL,
        paramsSerializer,
        timeout: (_a = merchantConfig.timeout) !== null && _a !== void 0 ? _a : 20000,
        transformResponse
    });
    // add auth headers
    axiosInstance.interceptors.request.use(config => config.method === 'get'
        ? handleGetRequest(merchantConfig, config)
        : config.method === 'post'
            ? handlePostRequest(merchantConfig, config)
            : config);
    axiosInstance.interceptors.response.use((res) => {
        if (!res.data) {
            throw new Error('Empty result');
        }
        if (res.data.returnCode.length !== 4) {
            throw new Error('Length of returnCode should be 4');
        }
        if (!res.data.returnCode.startsWith('0')) {
            throw new line_pay_api_1.LinePayApiError(res.data.returnMessage, res.status, res.data);
        }
        return res;
    }, err => {
        if (err.response !== undefined) {
            throw new http_1.HttpError(err.message, err.response.status, err.response.data);
        }
        else if (err.response === undefined && err.code === 'ECONNABORTED') {
            throw new timeout_1.TimeoutError(err.message);
        }
        throw err;
    });
    return axiosInstance;
}
exports.createAuthHttpClient = createAuthHttpClient;
//# sourceMappingURL=auth-http-client.js.map