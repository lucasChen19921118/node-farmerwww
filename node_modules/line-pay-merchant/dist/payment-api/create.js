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
exports.createPaymentApi = void 0;
/**
 * Create a new Payment API instance
 *
 * @template T
 * @param type LINE Pay API type
 * @param createSender create a request sender function
 * @param httpClient the HTTP client
 * @param handlers handlers to add to the API client
 * @returns a new Payment API instance
 */
function createPaymentApi(type, createSender, httpClient, handlers = []) {
    const addHandlers = (...fs) => {
        handlers.push(...fs);
        return createPaymentApi(type, createSender, httpClient, handlers);
    };
    // Wrap API response to add comments
    const sender = (req) => __awaiter(this, void 0, void 0, function* () {
        return ({
            body: yield createSender(httpClient)(req),
            comments: {}
        });
    });
    const getHandler = (i) => (req) => __awaiter(this, void 0, void 0, function* () {
        return i < 0
            ? sender(req)
            : handlers[i]({
                type,
                req,
                next: getHandler(i - 1),
                httpClient
            });
    });
    const send = (req) => __awaiter(this, void 0, void 0, function* () { return getHandler(handlers.length - 1)(req); });
    return {
        addHandler: addHandlers,
        addHandlers,
        send
    };
}
exports.createPaymentApi = createPaymentApi;
//# sourceMappingURL=create.js.map