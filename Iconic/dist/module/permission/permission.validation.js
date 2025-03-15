"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPermissionUpdate = exports.verifyPermission = void 0;
const express_validation_1 = require("express-validation");
const PermissionValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        permissionTypeId: express_validation_1.Joi.number().required(),
    })
};
exports.verifyPermission = (0, express_validation_1.validate)(PermissionValidation);
const PermissionUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().optional(),
        permissionTypeId: express_validation_1.Joi.number().optional(),
    })
};
exports.verifyPermissionUpdate = (0, express_validation_1.validate)(PermissionUpdateValidation);
