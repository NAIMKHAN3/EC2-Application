"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTripReport = exports.verifyPayment = void 0;
const express_validation_1 = require("express-validation");
const paymentValidation = {
    body: express_validation_1.Joi.object({
        registrationNo: express_validation_1.Joi.string().required(),
        fuelCompanyId: express_validation_1.Joi.number().required(),
        amount: express_validation_1.Joi.number().required(),
        payments: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
            accountId: express_validation_1.Joi.number().required(),
            paymentAmount: express_validation_1.Joi.number().required(),
        })),
    })
};
exports.verifyPayment = (0, express_validation_1.validate)(paymentValidation, {}, {});
const tripReportValidation = {
    query: express_validation_1.Joi.object({
        fromDate: express_validation_1.Joi.string().required(),
        toDate: express_validation_1.Joi.string().required(),
        registrationNo: express_validation_1.Joi.string().required(),
    })
};
exports.verifyTripReport = (0, express_validation_1.validate)(tripReportValidation, {}, {});
