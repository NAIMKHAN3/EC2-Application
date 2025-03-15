"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCoachListGet = exports.verifyCoachConfigUpdate = exports.verifyCoachConfig = void 0;
const express_validation_1 = require("express-validation");
const coachConfigValidation = {
    body: express_validation_1.Joi.object({
        coachNo: express_validation_1.Joi.string().required(),
        registrationNo: express_validation_1.Joi.string().optional(),
        routeId: express_validation_1.Joi.number().required(),
        supervisorId: express_validation_1.Joi.number().optional(),
        driverId: express_validation_1.Joi.number().optional(),
        helperId: express_validation_1.Joi.number().optional(),
        fareId: express_validation_1.Joi.number().required(),
        discount: express_validation_1.Joi.number().required(),
        fromCounterId: express_validation_1.Joi.number().required(),
        destinationCounterId: express_validation_1.Joi.number().required(),
        tokenAvailable: express_validation_1.Joi.number().required(),
        coachType: express_validation_1.Joi.string().required().valid("AC", "NON AC"),
        coachClass: express_validation_1.Joi.string().required().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        schedule: express_validation_1.Joi.string().required(),
        departureDates: express_validation_1.Joi.array().items(express_validation_1.Joi.string().required()).required(), // date format Ex: yyyy-MM-dd
        holdingTime: express_validation_1.Joi.string().optional(),
        note: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyCoachConfig = (0, express_validation_1.validate)(coachConfigValidation);
const coachConfigUpdateValidation = {
    body: express_validation_1.Joi.object({
        coachNo: express_validation_1.Joi.string().optional(),
        registrationNo: express_validation_1.Joi.string().optional(),
        routeId: express_validation_1.Joi.number().optional(),
        supervisorId: express_validation_1.Joi.number().optional(),
        driverId: express_validation_1.Joi.number().optional(),
        helperId: express_validation_1.Joi.number().optional(),
        fareId: express_validation_1.Joi.number().optional(),
        discount: express_validation_1.Joi.number().optional(),
        fromCounterId: express_validation_1.Joi.number().optional(),
        destinationCounterId: express_validation_1.Joi.number().optional(),
        tokenAvailable: express_validation_1.Joi.number().optional(),
        coachType: express_validation_1.Joi.string().optional().valid("AC", "NON AC"),
        coachClass: express_validation_1.Joi.string().optional().valid("E_Class", "B_Class", "S_Class", "Sleeper"),
        schedule: express_validation_1.Joi.string().optional(),
        supervisorStatus: express_validation_1.Joi.string().optional().valid("Accepted", "Cancelled"),
        driverStatus: express_validation_1.Joi.string().optional().valid("Accepted", "Cancelled"),
        helperStatus: express_validation_1.Joi.string().optional().valid("Accepted", "Cancelled"),
        departureDate: express_validation_1.Joi.string().optional(), // date format Ex: yyyy-MM-dd
        holdingTime: express_validation_1.Joi.string().optional(),
        note: express_validation_1.Joi.string().optional(),
        active: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyCoachConfigUpdate = (0, express_validation_1.validate)(coachConfigUpdateValidation);
const coachListValidation = {
    query: express_validation_1.Joi.object({
        fromCounterId: express_validation_1.Joi.string().required(),
        destinationCounterId: express_validation_1.Joi.string().required(),
        orderType: express_validation_1.Joi.string().required().valid("One_Trip", "Round_Trip"),
        coachType: express_validation_1.Joi.string().optional().valid("AC", "NON AC"),
        date: express_validation_1.Joi.string().required(), // date format Ex: yyyy-MM-dd
        returnDate: express_validation_1.Joi.string().optional(), // date format Ex: yyyy-MM-dd
    })
};
exports.verifyCoachListGet = (0, express_validation_1.validate)(coachListValidation);
