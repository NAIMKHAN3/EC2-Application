"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyReserveUpdate = exports.verifyReserve = void 0;
const express_validation_1 = require("express-validation");
const reserveValidation = {
    body: express_validation_1.Joi.object({
        registrationNo: express_validation_1.Joi.string().required(),
        routeId: express_validation_1.Joi.number().required(),
        noOfSeat: express_validation_1.Joi.number().required(),
        coachClass: express_validation_1.Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        fromDate: express_validation_1.Joi.string().required(),
        fromDateTime: express_validation_1.Joi.string().optional(),
        toDate: express_validation_1.Joi.string().required(),
        toDateTime: express_validation_1.Joi.string().optional(),
        passengerName: express_validation_1.Joi.string().required(),
        contactNo: express_validation_1.Joi.string().required(),
        address: express_validation_1.Joi.string().required(),
        amount: express_validation_1.Joi.number().required(),
        paidAmount: express_validation_1.Joi.number().required(),
        dueAmount: express_validation_1.Joi.number().required(),
        remarks: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyReserve = (0, express_validation_1.validate)(reserveValidation);
const reserveUpdateValidation = {
    body: express_validation_1.Joi.object({
        registrationNo: express_validation_1.Joi.string().optional(),
        routeId: express_validation_1.Joi.number().optional(),
        noOfSeat: express_validation_1.Joi.number().optional(),
        coachClass: express_validation_1.Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        fromDate: express_validation_1.Joi.string().optional(),
        fromDateTime: express_validation_1.Joi.string().optional(),
        toDate: express_validation_1.Joi.string().optional(),
        toDateTime: express_validation_1.Joi.string().optional(),
        from: express_validation_1.Joi.string().optional(),
        to: express_validation_1.Joi.string().optional(),
        passengerName: express_validation_1.Joi.string().optional(),
        contactNo: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        amount: express_validation_1.Joi.number().optional(),
        paidAmount: express_validation_1.Joi.number().optional(),
        dueAmount: express_validation_1.Joi.number().optional(),
        remarks: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyReserveUpdate = (0, express_validation_1.validate)(reserveUpdateValidation);
