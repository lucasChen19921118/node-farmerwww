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
const __1 = require("..");
const timeout_retry_1 = require("./timeout-retry");
const httpClient = {
    get: jest.fn(),
    post: jest.fn()
};
jest.useFakeTimers();
beforeEach(() => {
    jest.clearAllTimers();
});
describe('timeout-retry handler', () => {
    it('should not retry if "next" throws any exception other than Timeout Error', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const maxRetry = 20;
        const retryTimeout = 1000;
        const type = 'refund';
        const req = {
            transactionId: 'transactionId',
            body: {
                refundAmount: 100
            }
        };
        const message = 'other error';
        const next = jest.fn(() => {
            throw new __1.LinePayApiError(message, 200, {
                returnCode: '2000',
                returnMessage: 'message'
            });
        });
        const handler = (0, timeout_retry_1.createTimeoutRetryHandler)(maxRetry, retryTimeout);
        const p = handler({ type, req, next, httpClient });
        jest.runAllTimers();
        expect(next).toBeCalledTimes(1);
        try {
            yield p;
        }
        catch (e) {
            expect(e).toBeInstanceOf(__1.LinePayApiError);
        }
    }));
    it('should retry every "retryTimeout" millisecond', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(3);
        const maxRetry = 20;
        const retryTimeout = 1000;
        const type = 'refund';
        const req = {
            transactionId: 'transactionId',
            body: {
                refundAmount: 100
            }
        };
        const message = 'timeout error';
        const next = jest.fn(() => {
            throw new __1.TimeoutError(message);
        });
        const handler = (0, timeout_retry_1.createTimeoutRetryHandler)(maxRetry, retryTimeout);
        const p = handler({ type, req, next, httpClient });
        const retryNumberOfTimes = 5;
        jest.advanceTimersByTime(retryTimeout * retryNumberOfTimes);
        expect(next).toBeCalledTimes(retryNumberOfTimes + 1);
        jest.runAllTimers();
        try {
            yield p;
        }
        catch (e) {
            expect(e).toBeInstanceOf(__1.TimeoutError);
            if (e instanceof __1.TimeoutError) {
                expect(e.message).toBe(message);
            }
        }
    }));
    it('should use default value for "retryTimeout" if no value is passed', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(3);
        const maxRetry = 20;
        const retryTimeout = 5000;
        const type = 'refund';
        const req = {
            transactionId: 'transactionId',
            body: {
                refundAmount: 100
            }
        };
        const message = 'timeout error';
        const next = jest.fn(() => {
            throw new __1.TimeoutError(message);
        });
        const handler = (0, timeout_retry_1.createTimeoutRetryHandler)(maxRetry);
        const p = handler({ type, req, next, httpClient });
        const retryNumberOfTimes = 5;
        jest.advanceTimersByTime(retryTimeout * retryNumberOfTimes);
        expect(next).toBeCalledTimes(retryNumberOfTimes + 1);
        jest.runAllTimers();
        try {
            yield p;
        }
        catch (e) {
            expect(e).toBeInstanceOf(__1.TimeoutError);
            if (e instanceof __1.TimeoutError) {
                expect(e.message).toBe(message);
            }
        }
    }));
    it('should retry "maxRetry" times if "next" throws Timeout Error every time', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(3);
        const maxRetry = 20;
        const retryTimeout = 1000;
        const type = 'refund';
        const req = {
            transactionId: 'transactionId',
            body: {
                refundAmount: 100
            }
        };
        const message = 'timeout error';
        const next = jest.fn(() => {
            throw new __1.TimeoutError(message);
        });
        const handler = (0, timeout_retry_1.createTimeoutRetryHandler)(maxRetry, retryTimeout);
        const p = handler({ type, req, next, httpClient });
        jest.runAllTimers();
        expect(next).toBeCalledTimes(maxRetry + 1);
        try {
            yield p;
        }
        catch (e) {
            expect(e).toBeInstanceOf(__1.TimeoutError);
            if (e instanceof __1.TimeoutError) {
                expect(e.message).toBe(message);
            }
        }
    }));
    it('should use default value for "maxRetry" if no value is passed', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(3);
        const maxRetry = 10;
        const type = 'refund';
        const req = {
            transactionId: 'transactionId',
            body: {
                refundAmount: 100
            }
        };
        const message = 'timeout error';
        const next = jest.fn(() => {
            throw new __1.TimeoutError(message);
        });
        const handler = (0, timeout_retry_1.createTimeoutRetryHandler)();
        const p = handler({ type, req, next, httpClient });
        jest.runAllTimers();
        expect(next).toBeCalledTimes(maxRetry + 1);
        try {
            yield p;
        }
        catch (e) {
            expect(e).toBeInstanceOf(__1.TimeoutError);
            if (e instanceof __1.TimeoutError) {
                expect(e.message).toBe(message);
            }
        }
    }));
});
it('should retry n times if the nth "next" call throws error other than Timeout Error', () => __awaiter(void 0, void 0, void 0, function* () {
    expect.assertions(3);
    const maxRetry = 20;
    const retryTimeout = 1000;
    const retryNumberOfTimes = 1;
    const type = 'refund';
    const req = {
        transactionId: 'transactionId',
        body: {
            refundAmount: 100
        }
    };
    const message = 'API Error';
    const next = jest.fn();
    for (let i = 0; i < retryNumberOfTimes; i++) {
        next.mockImplementationOnce(() => {
            throw new __1.TimeoutError('timeout error');
        });
    }
    next.mockImplementationOnce(() => {
        throw new __1.LinePayApiError(message, 200, {
            returnCode: '2000',
            returnMessage: 'message'
        });
    });
    next.mockImplementationOnce(() => {
        throw new __1.TimeoutError('timeout error');
    });
    const handler = (0, timeout_retry_1.createTimeoutRetryHandler)(maxRetry, retryTimeout);
    const p = handler({ type, req, next, httpClient });
    jest.runAllTimers();
    expect(next).toBeCalledTimes(retryNumberOfTimes + 1);
    try {
        yield p;
    }
    catch (e) {
        expect(e).toBeInstanceOf(__1.LinePayApiError);
        if (e instanceof __1.LinePayApiError) {
            expect(e.message).toBe(message);
        }
    }
}));
it('should retry n times if the nth "next" call does not throw exception', () => __awaiter(void 0, void 0, void 0, function* () {
    expect.assertions(2);
    const maxRetry = 20;
    const retryTimeout = 1000;
    const retryNumberOfTimes = 1;
    const type = 'refund';
    const req = {
        transactionId: 'transactionId',
        body: {
            refundAmount: 100
        }
    };
    const res = {
        body: {
            returnCode: '0000',
            returnMessage: 'Success.',
            info: {
                refundTransactionId: '2021121600698710312',
                refundTransactionDate: '2021-12-16T00:50:15Z'
            }
        },
        comments: {}
    };
    const next = jest.fn();
    for (let i = 0; i < retryNumberOfTimes; i++) {
        next.mockImplementationOnce(() => {
            throw new __1.TimeoutError('timeout error');
        });
    }
    next.mockResolvedValueOnce(res);
    next.mockImplementationOnce(() => {
        throw new __1.TimeoutError('timeout error');
    });
    const handler = (0, timeout_retry_1.createTimeoutRetryHandler)(maxRetry, retryTimeout);
    const p = handler({ type, req, next, httpClient });
    jest.runAllTimers();
    expect(next).toBeCalledTimes(retryNumberOfTimes + 1);
    expect(yield p).toEqual(res);
}));
//# sourceMappingURL=timeout-retry.test.js.map