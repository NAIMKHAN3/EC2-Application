"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAboutUsUpdate = exports.verifyAboutUs = void 0;
const express_validation_1 = require("express-validation");
const aboutUsValidation = {
    body: express_validation_1.Joi.object({
        description: express_validation_1.Joi.string().required(),
        image: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyAboutUs = (0, express_validation_1.validate)(aboutUsValidation, {}, {});
const aboutUsUpdateValidation = {
    body: express_validation_1.Joi.object({
        description: express_validation_1.Joi.string().optional(),
        image: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyAboutUsUpdate = (0, express_validation_1.validate)(aboutUsUpdateValidation, {}, {});
