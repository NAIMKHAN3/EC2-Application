"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySeatUpdate = exports.verifySeat = void 0;
const express_validation_1 = require("express-validation");
const seatValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifySeat = (0, express_validation_1.validate)(seatValidation);
const seatUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifySeatUpdate = (0, express_validation_1.validate)(seatUpdateValidation);
