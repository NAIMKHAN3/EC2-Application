"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDiscountUpdate = exports.verifyDiscount = void 0;
const express_validation_1 = require("express-validation");
const discountValidation = {
    body: express_validation_1.Joi.object({
        title: express_validation_1.Joi.string().required(),
        discountType: express_validation_1.Joi.string().required().valid("Fixed", "Percentage"),
        discount: express_validation_1.Joi.number().required(),
        startDate: express_validation_1.Joi.date().required(),
        endDate: express_validation_1.Joi.date().required(),
    })
};
exports.verifyDiscount = (0, express_validation_1.validate)(discountValidation);
const discountUpdateValidation = {
    body: express_validation_1.Joi.object({
        title: express_validation_1.Joi.string().optional(),
        discountType: express_validation_1.Joi.string().optional().valid("Fixed", "Percentage"),
        discount: express_validation_1.Joi.number().optional(),
        startDate: express_validation_1.Joi.date().optional(),
        endDate: express_validation_1.Joi.date().optional(),
    })
};
exports.verifyDiscountUpdate = (0, express_validation_1.validate)(discountUpdateValidation);
