"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStationUpdate = exports.verifyStation = void 0;
const express_validation_1 = require("express-validation");
const stationValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyStation = (0, express_validation_1.validate)(stationValidation);
const stationUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyStationUpdate = (0, express_validation_1.validate)(stationUpdateValidation);
