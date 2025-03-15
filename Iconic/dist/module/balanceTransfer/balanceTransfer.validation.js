"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBalanceTransfer = void 0;
const express_validation_1 = require("express-validation");
const balanceTransferValidation = {
    body: express_validation_1.Joi.object({
        fromAccountId: express_validation_1.Joi.number().required(),
        toAccountId: express_validation_1.Joi.number().required(),
        amount: express_validation_1.Joi.number().required(),
    })
};
exports.verifyBalanceTransfer = (0, express_validation_1.validate)(balanceTransferValidation);
