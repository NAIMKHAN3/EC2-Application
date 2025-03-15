"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDriverUpdate = exports.verifyDriverReg = void 0;
const express_validation_1 = require("express-validation");
const driverRegisterValidation = {
    body: express_validation_1.Joi.object({
        referenceBy: express_validation_1.Joi.string().required(),
        name: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().email().optional(),
        contactNo: express_validation_1.Joi.string().required(),
        emergencyNumber: express_validation_1.Joi.string().required(),
        licenseNumber: express_validation_1.Joi.string().required(),
        licenseIssueDate: express_validation_1.Joi.string().required(),
        licenseExpDate: express_validation_1.Joi.string().required(),
        licensePhoto: express_validation_1.Joi.string().required(),
        dateOfBirth: express_validation_1.Joi.string().optional(),
        gender: express_validation_1.Joi.string().optional().valid('Male', 'Female'),
        maritalStatus: express_validation_1.Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        avatar: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyDriverReg = (0, express_validation_1.validate)(driverRegisterValidation, {}, {});
const driverUpdateValidation = {
    body: express_validation_1.Joi.object({
        referenceBy: express_validation_1.Joi.string().optional(),
        name: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().email().optional().allow(''),
        contactNo: express_validation_1.Joi.string().optional(),
        emergencyNumber: express_validation_1.Joi.string().optional(),
        licenseNumber: express_validation_1.Joi.string().optional(),
        licenseIssueDate: express_validation_1.Joi.string().optional(),
        licenseExpDate: express_validation_1.Joi.string().optional(),
        licensePhoto: express_validation_1.Joi.string().optional(),
        dateOfBirth: express_validation_1.Joi.string().optional().allow(''),
        gender: express_validation_1.Joi.string().optional().valid('Male', 'Female'),
        maritalStatus: express_validation_1.Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: express_validation_1.Joi.string().optional().allow(''),
        address: express_validation_1.Joi.string().optional().allow(''),
        avatar: express_validation_1.Joi.string().optional(),
        active: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyDriverUpdate = (0, express_validation_1.validate)(driverUpdateValidation, {}, {});
