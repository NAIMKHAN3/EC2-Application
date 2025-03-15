"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountQuery = exports.verifyUpdateAccount = exports.verifyAccount = void 0;
const express_validation_1 = require("express-validation");
const accountRegistration = {
    body: express_validation_1.Joi.object({
        bankName: express_validation_1.Joi.string().required(),
        accountHolderName: express_validation_1.Joi.string().required(),
        accountName: express_validation_1.Joi.string().required(),
        accountNumber: express_validation_1.Joi.string().required(),
        accountType: express_validation_1.Joi.string().required().valid('MobileBanking', 'Bank', 'Cash'),
        openingBalance: express_validation_1.Joi.number().required(),
    })
};
exports.verifyAccount = (0, express_validation_1.validate)(accountRegistration, {}, {});
const accountUpdate = {
    body: express_validation_1.Joi.object({
        bankName: express_validation_1.Joi.string().optional().allow(''),
        accountHolderName: express_validation_1.Joi.string().optional().allow(''),
        accountName: express_validation_1.Joi.string().optional(),
        accountNumber: express_validation_1.Joi.string().optional(),
        accountType: express_validation_1.Joi.string().optional().valid('MobileBanking', 'Bank', 'Cash'),
    })
};
exports.verifyUpdateAccount = (0, express_validation_1.validate)(accountUpdate, {}, {});
const accountQuery = {
    query: express_validation_1.Joi.object({
        type: express_validation_1.Joi.string().required().valid('MobileBanking', 'Bank', 'Cash', 'All'),
    })
};
exports.verifyAccountQuery = (0, express_validation_1.validate)(accountQuery, {}, {});
