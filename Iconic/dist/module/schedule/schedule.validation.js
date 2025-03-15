"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyScheduleUpdate = exports.verifySchedule = void 0;
const express_validation_1 = require("express-validation");
const scheduleValidation = {
    body: express_validation_1.Joi.object({
        time: express_validation_1.Joi.string().required(),
    })
};
exports.verifySchedule = (0, express_validation_1.validate)(scheduleValidation);
const scheduleUpdateValidation = {
    body: express_validation_1.Joi.object({
        time: express_validation_1.Joi.string().required(),
    })
};
exports.verifyScheduleUpdate = (0, express_validation_1.validate)(scheduleUpdateValidation);
