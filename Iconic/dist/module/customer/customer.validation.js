"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCustomerUpdate = exports.verifyCustomer = void 0;
const express_validation_1 = require("express-validation");
const customerRegisterValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().optional().allow(''),
        phone: express_validation_1.Joi.string().required(),
        address: express_validation_1.Joi.string().required().allow(''),
    })
};
exports.verifyCustomer = (0, express_validation_1.validate)(customerRegisterValidation, {}, {});
const customerUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().optional(),
        phone: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyCustomerUpdate = (0, express_validation_1.validate)(customerUpdateValidation, {}, {});
