"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserPermissionUpdate = exports.verifyUserPermission = void 0;
const express_validation_1 = require("express-validation");
const userPermissionValidation = {
    body: express_validation_1.Joi.object({
        userId: express_validation_1.Joi.number().required(),
        permissionId: express_validation_1.Joi.number().required()
    })
};
exports.verifyUserPermission = (0, express_validation_1.validate)(userPermissionValidation);
const userPermissionUpdateValidation = {
    body: express_validation_1.Joi.object({
        userId: express_validation_1.Joi.number().optional(),
        permissionId: express_validation_1.Joi.number().optional()
    })
};
exports.verifyUserPermissionUpdate = (0, express_validation_1.validate)(userPermissionUpdateValidation);
