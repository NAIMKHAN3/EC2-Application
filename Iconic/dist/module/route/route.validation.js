"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRouteUpdate = exports.verifyRoute = void 0;
const express_validation_1 = require("express-validation");
const routeValidation = {
    body: express_validation_1.Joi.object({
        routeType: express_validation_1.Joi.string().optional().valid("Local", "International"),
        routeDirection: express_validation_1.Joi.string().optional().valid("Up_Way", "Down_Way"),
        kilo: express_validation_1.Joi.number().optional(),
        isPassengerInfoRequired: express_validation_1.Joi.boolean().optional(),
        via: express_validation_1.Joi.string().optional(),
        from: express_validation_1.Joi.number().required(),
        to: express_validation_1.Joi.number().required(),
        routeName: express_validation_1.Joi.string().required(),
        viaStations: express_validation_1.Joi.array().items(express_validation_1.Joi.number().required()).required(),
    })
};
exports.verifyRoute = (0, express_validation_1.validate)(routeValidation);
const routeUpdateValidation = {
    body: express_validation_1.Joi.object({
        routeType: express_validation_1.Joi.string().optional().valid("Local", "International"),
        routeDirection: express_validation_1.Joi.string().optional().valid("Up_Way", "Down_Way"),
        kilo: express_validation_1.Joi.number().optional(),
        isPassengerInfoRequired: express_validation_1.Joi.boolean().optional(),
        via: express_validation_1.Joi.string().optional(),
        from: express_validation_1.Joi.number().optional(),
        to: express_validation_1.Joi.number().optional(),
        routeName: express_validation_1.Joi.string().optional(),
        viaStations: express_validation_1.Joi.array().items(express_validation_1.Joi.number().required()).required(),
    })
};
exports.verifyRouteUpdate = (0, express_validation_1.validate)(routeUpdateValidation);
