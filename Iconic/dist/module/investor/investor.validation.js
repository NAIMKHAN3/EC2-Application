"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUpdateInvestor = exports.verifyInvestor = void 0;
const express_validation_1 = require("express-validation");
const investorValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().email().optional(),
        phone: express_validation_1.Joi.string().required(),
        address: express_validation_1.Joi.string().optional(),
        city: express_validation_1.Joi.string().optional(),
        postalCode: express_validation_1.Joi.string().optional(),
        country: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyInvestor = (0, express_validation_1.validate)(investorValidation, {}, {});
const updateInvestorValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().email().optional(),
        phone: express_validation_1.Joi.string().required(),
        address: express_validation_1.Joi.string().optional(),
        city: express_validation_1.Joi.string().optional(),
        postalCode: express_validation_1.Joi.string().optional(),
        country: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyUpdateInvestor = (0, express_validation_1.validate)(updateInvestorValidation);
