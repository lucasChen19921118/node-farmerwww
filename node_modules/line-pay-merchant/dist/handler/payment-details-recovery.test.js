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
const line_pay_api_1 = require("../line-pay-api/error/line-pay-api");
const payment_details_recovery_1 = require("./payment-details-recovery");
describe('payment-details-recovery handler', () => {
    it('should call httpClient.post', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(3);
        const details = {
            returnCode: '0000',
            returnMessage: 'message'
        };
        const httpClient = {
            get: jest
                .fn()
                .mockImplementation(() => Promise.resolve({ data: details })),
            post: jest.fn()
        };
        const converter = jest.fn();
        const predicate = jest.fn().mockImplementation(() => true);
        const handler = (0, payment_details_recovery_1.createPaymentDetailsRecoveryHandler)(converter, predicate);
        const type = 'refund';
        const req = {
            transactionId: 'transactionId',
            body: {
                refundAmount: 100
            }
        };
        const message = 'other error';
        const error = new line_pay_api_1.LinePayApiError(message, 200, {
            returnCode: '2000',
            returnMessage: 'message'
        });
        const next = jest.fn(() => {
            throw error;
        });
        const p = handler({ type, req, next, httpClient });
        expect(next).toBeCalledTimes(1);
        yield p;
        expect(converter).toBeCalledWith(req, details);
        expect(predicate).toBeCalledWith(error);
    }));
});
//# sourceMappingURL=payment-details-recovery.test.js.map