"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyChangePassword = exports.verifyForgetChangePassword = exports.verifyOtpVerify = exports.verifyForget = exports.verifyUserLogin = exports.verifyUserReg = void 0;
const express_validation_1 = require("express-validation");
const userRegisterValidation = {
    body: express_validation_1.Joi.object({
        userName: express_validation_1.Joi.string().required(),
        email: express_validation_1.Joi.string().email().optional(),
        password: express_validation_1.Joi.string().required().min(6).max(12),
        contactNo: express_validation_1.Joi.string().optional(),
        roleId: express_validation_1.Joi.number().required(),
        counterId: express_validation_1.Joi.number().required(),
        dateOfBirth: express_validation_1.Joi.string().optional(),
        gender: express_validation_1.Joi.string().optional().valid('Male', 'Female'),
        maritalStatus: express_validation_1.Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        avatar: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyUserReg = (0, express_validation_1.validate)(userRegisterValidation, {}, {});
const userLoginValidation = {
    body: express_validation_1.Joi.object({
        userName: express_validation_1.Joi.string().required(),
        password: express_validation_1.Joi.string().required().min(6).max(12)
    })
};
exports.verifyUserLogin = (0, express_validation_1.validate)(userLoginValidation, {}, {});
const forgetValidation = {
    body: express_validation_1.Joi.object({
        userName: express_validation_1.Joi.string().required(),
    })
};
exports.verifyForget = (0, express_validation_1.validate)(forgetValidation, {}, {});
const otpValidation = {
    body: express_validation_1.Joi.object({
        otp: express_validation_1.Joi.number().required(),
        otpToken: express_validation_1.Joi.string().required(),
    })
};
exports.verifyOtpVerify = (0, express_validation_1.validate)(otpValidation, {}, {});
const forgetChangePasswordValidation = {
    body: express_validation_1.Joi.object({
        otp: express_validation_1.Joi.number().required(),
        otpToken: express_validation_1.Joi.string().required(),
        newPassword: express_validation_1.Joi.string().required().min(6).max(12),
        confirmPassword: express_validation_1.Joi.any()
            .equal(express_validation_1.Joi.ref("newPassword"))
            .required()
            .label("Confirm password")
            .options({ messages: { "any.only": "{{#label}} does not match" } }),
    })
};
exports.verifyForgetChangePassword = (0, express_validation_1.validate)(forgetChangePasswordValidation, {}, {});
const changePasswordValidation = {
    body: express_validation_1.Joi.object({
        oldPassword: express_validation_1.Joi.string().required(),
        newPassword: express_validation_1.Joi.string().required().min(6).max(12),
        confirmPassword: express_validation_1.Joi.any()
            .equal(express_validation_1.Joi.ref("newPassword"))
            .required()
            .label("Confirm password")
            .options({ messages: { "any.only": "{{#label}} does not match" } }),
    })
};
exports.verifyChangePassword = (0, express_validation_1.validate)(changePasswordValidation, {}, {});
