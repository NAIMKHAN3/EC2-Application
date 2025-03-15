"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFuelCompanyUpdate = exports.verifyFuelCompany = void 0;
const express_validation_1 = require("express-validation");
const fuelCompanyValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        address: express_validation_1.Joi.string().required(),
        phone: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().optional().email(),
        website: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyFuelCompany = (0, express_validation_1.validate)(fuelCompanyValidation, {}, {});
const fuelCompanyUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        phone: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().optional().email(),
        website: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyFuelCompanyUpdate = (0, express_validation_1.validate)(fuelCompanyUpdateValidation, {}, {});
