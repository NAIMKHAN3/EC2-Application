"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInvesting = void 0;
const express_validation_1 = require("express-validation");
const investingValidation = {
    body: express_validation_1.Joi.object({
        investorId: express_validation_1.Joi.number().required(),
        investingBalances: express_validation_1.Joi.number().required(),
        investingType: express_validation_1.Joi.string().required().valid('Investing', 'BankLoan', 'KarzeHasana'),
        interest: express_validation_1.Joi.number().optional(),
        note: express_validation_1.Joi.string().optional(),
        payments: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
            accountId: express_validation_1.Joi.number().required(),
            paymentAmount: express_validation_1.Joi.number().required(),
        })).required(),
    })
};
exports.verifyInvesting = (0, express_validation_1.validate)(investingValidation, {}, {});
