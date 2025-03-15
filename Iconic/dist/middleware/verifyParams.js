"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyParams = void 0;
const express_validation_1 = require("express-validation");
const validationParams = {
    params: express_validation_1.Joi.object({
        id: express_validation_1.Joi.string().required(),
    }),
};
exports.verifyParams = (0, express_validation_1.validate)(validationParams);
