"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCoachUpdate = exports.verifyCoach = void 0;
const express_validation_1 = require("express-validation");
const coachValidation = {
    body: express_validation_1.Joi.object({
        coachNo: express_validation_1.Joi.string().required(),
        schedule: express_validation_1.Joi.string().required(),
        routeId: express_validation_1.Joi.number().required(),
        noOfSeat: express_validation_1.Joi.number().required(),
        fromCounterId: express_validation_1.Joi.number().required(),
        destinationCounterId: express_validation_1.Joi.number().required(),
        fareId: express_validation_1.Joi.number().required(),
    })
};
exports.verifyCoach = (0, express_validation_1.validate)(coachValidation);
const coachUpdateValidation = {
    body: express_validation_1.Joi.object({
        coachNo: express_validation_1.Joi.string().optional(),
        schedule: express_validation_1.Joi.string().optional(),
        routeId: express_validation_1.Joi.number().optional(),
        noOfSeat: express_validation_1.Joi.number().optional(),
        fromCounterId: express_validation_1.Joi.number().optional(),
        destinationCounterId: express_validation_1.Joi.number().optional(),
        fareId: express_validation_1.Joi.number().optional(),
        active: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyCoachUpdate = (0, express_validation_1.validate)(coachUpdateValidation);
