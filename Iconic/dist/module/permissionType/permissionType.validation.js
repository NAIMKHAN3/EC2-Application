"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPermissionTypeUpdate = exports.verifyPermissionType = void 0;
const express_validation_1 = require("express-validation");
const PermissionTypeValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyPermissionType = (0, express_validation_1.validate)(PermissionTypeValidation);
const PermissionTypeUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyPermissionTypeUpdate = (0, express_validation_1.validate)(PermissionTypeUpdateValidation);
