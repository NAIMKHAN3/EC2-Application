"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRolePermissionUpdate = exports.verifyRolePermission = void 0;
const express_validation_1 = require("express-validation");
const rolePermissionValidation = {
    body: express_validation_1.Joi.object({
        role: express_validation_1.Joi.string().required().valid("Partner", "Admin", "Guest"),
        permissionId: express_validation_1.Joi.number().required()
    })
};
exports.verifyRolePermission = (0, express_validation_1.validate)(rolePermissionValidation);
const rolePermissionUpdateValidation = {
    body: express_validation_1.Joi.object({
        role: express_validation_1.Joi.string().optional().valid("Manager", "SuperVisor", "Accounts"),
        permissionId: express_validation_1.Joi.number().optional()
    })
};
exports.verifyRolePermissionUpdate = (0, express_validation_1.validate)(rolePermissionUpdateValidation);
