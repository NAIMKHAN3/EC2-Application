"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFareUpdate = exports.verifyFare = void 0;
const express_validation_1 = require("express-validation");
const fareValidation = {
    body: express_validation_1.Joi.object({
        route: express_validation_1.Joi.string().required(),
        amount: express_validation_1.Joi.number().required(),
        type: express_validation_1.Joi.string().required().valid("AC", "NON AC"),
        fromDate: express_validation_1.Joi.date().optional(),
        toDate: express_validation_1.Joi.date().optional(),
    })
};
exports.verifyFare = (0, express_validation_1.validate)(fareValidation);
const fareUpdateValidation = {
    body: express_validation_1.Joi.object({
        route: express_validation_1.Joi.string().optional(),
        amount: express_validation_1.Joi.number().optional(),
        type: express_validation_1.Joi.string().optional().valid("AC", "NON AC"),
        fromDate: express_validation_1.Joi.date().optional(),
        toDate: express_validation_1.Joi.date().optional(),
    })
};
exports.verifyFareUpdate = (0, express_validation_1.validate)(fareUpdateValidation);
