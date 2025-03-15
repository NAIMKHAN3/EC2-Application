"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCounterUpdate = exports.verifyCounter = void 0;
const express_validation_1 = require("express-validation");
const counterValidation = {
    body: express_validation_1.Joi.object({
        type: express_validation_1.Joi.string().required().valid("Own_Counter", "Commission_Counter", "Head_Office"),
        name: express_validation_1.Joi.string().required(),
        address: express_validation_1.Joi.string().required(),
        landMark: express_validation_1.Joi.string().optional(),
        locationUrl: express_validation_1.Joi.string().optional(),
        phone: express_validation_1.Joi.string().optional(),
        mobile: express_validation_1.Joi.string().required(),
        fax: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().email().optional(),
        primaryContactPersonName: express_validation_1.Joi.string().required(),
        country: express_validation_1.Joi.string().optional(),
        stationId: express_validation_1.Joi.number().required(),
        status: express_validation_1.Joi.boolean().required(),
        commissionType: express_validation_1.Joi.string().optional().valid("Fixed", "Percentage"),
        commission: express_validation_1.Joi.number().optional(),
        bookingAllowStatus: express_validation_1.Joi.string().optional().valid("Coach_Wish", "Route_Wish", "Total"),
        bookingAllowClass: express_validation_1.Joi.string().optional().valid("B_Class", "E_Class", "Revolving", "Sleeper"),
        zone: express_validation_1.Joi.string().optional(),
        isSmsSend: express_validation_1.Joi.boolean().required(),
    })
};
exports.verifyCounter = (0, express_validation_1.validate)(counterValidation);
const counterUpdateValidation = {
    body: express_validation_1.Joi.object({
        type: express_validation_1.Joi.string().optional().valid("Own_Counter", "Commission_Counter", "Head_Office"),
        name: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        landMark: express_validation_1.Joi.string().optional(),
        locationUrl: express_validation_1.Joi.string().optional(),
        phone: express_validation_1.Joi.string().optional(),
        mobile: express_validation_1.Joi.string().optional(),
        fax: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().email().optional(),
        primaryContactPersonName: express_validation_1.Joi.string().optional(),
        country: express_validation_1.Joi.string().optional(),
        stationId: express_validation_1.Joi.number().optional(),
        status: express_validation_1.Joi.boolean().optional(),
        commissionType: express_validation_1.Joi.string().optional().valid("Fixed", "Percentage"),
        commission: express_validation_1.Joi.number().optional(),
        bookingAllowStatus: express_validation_1.Joi.string().optional().valid("Coach_Wish", "Route_Wish", "Total"),
        bookingAllowClass: express_validation_1.Joi.string().optional().valid("B_Class", "E_Class", "Revolving", "Sleeper"),
        zone: express_validation_1.Joi.string().optional(),
        isSmsSend: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyCounterUpdate = (0, express_validation_1.validate)(counterUpdateValidation);
