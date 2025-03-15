"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHelperUpdate = exports.verifyHelperReg = void 0;
const express_validation_1 = require("express-validation");
const HelperRegisterValidation = {
    body: express_validation_1.Joi.object({
        referenceBy: express_validation_1.Joi.string().optional(),
        name: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().email().optional(),
        contactNo: express_validation_1.Joi.string().required(),
        emergencyNumber: express_validation_1.Joi.string().required(),
        dateOfBirth: express_validation_1.Joi.string().optional(),
        gender: express_validation_1.Joi.string().optional().valid('Male', 'Female'),
        maritalStatus: express_validation_1.Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        avatar: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyHelperReg = (0, express_validation_1.validate)(HelperRegisterValidation, {}, {});
const HelperUpdateValidation = {
    body: express_validation_1.Joi.object({
        referenceBy: express_validation_1.Joi.string().optional(),
        name: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().email().optional().allow(''),
        contactNo: express_validation_1.Joi.string().optional(),
        emergencyNumber: express_validation_1.Joi.string().optional(),
        dateOfBirth: express_validation_1.Joi.string().optional().allow(''),
        gender: express_validation_1.Joi.string().optional().valid('Male', 'Female'),
        maritalStatus: express_validation_1.Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: express_validation_1.Joi.string().optional().allow(''),
        address: express_validation_1.Joi.string().optional().allow(''),
        avatar: express_validation_1.Joi.string().optional(),
        active: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyHelperUpdate = (0, express_validation_1.validate)(HelperUpdateValidation, {}, {});
