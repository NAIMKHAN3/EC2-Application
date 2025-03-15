"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRoleUpdate = exports.verifyRole = void 0;
const express_validation_1 = require("express-validation");
const RoleValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyRole = (0, express_validation_1.validate)(RoleValidation);
const RoleUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyRoleUpdate = (0, express_validation_1.validate)(RoleUpdateValidation);
