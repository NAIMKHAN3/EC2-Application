"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySupervisorReportAuthorize = exports.verifySupervisorReport = exports.verifyCounterReportSubmit = exports.verifySupervisorReportSubmit = exports.verifyUserUpdate = void 0;
const express_validation_1 = require("express-validation");
const userUpdateValidation = {
    body: express_validation_1.Joi.object({
        userName: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().email().optional(),
        password: express_validation_1.Joi.string().optional().min(6).max(12),
        contactNo: express_validation_1.Joi.string().optional(),
        roleId: express_validation_1.Joi.number().optional(),
        counterId: express_validation_1.Joi.number().optional(),
        dateOfBirth: express_validation_1.Joi.string().optional(),
        gender: express_validation_1.Joi.string().optional().valid('Male', 'Female'),
        maritalStatus: express_validation_1.Joi.string().optional().valid('Married', 'Unmarried'),
        bloodGroup: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        avatar: express_validation_1.Joi.string().optional(),
        active: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyUserUpdate = (0, express_validation_1.validate)(userUpdateValidation);
const supervisorReportSubmitValidation = {
    body: express_validation_1.Joi.object({
        tripNo: express_validation_1.Joi.number().required(),
        supervisorId: express_validation_1.Joi.number().required(),
        upWayCoachConfigId: express_validation_1.Joi.number().required(),
        downWayCoachConfigId: express_validation_1.Joi.number().required(),
        upWayDate: express_validation_1.Joi.string().required(),
        downWayDate: express_validation_1.Joi.string().required(),
        cashOnHand: express_validation_1.Joi.number().required(),
        totalIncome: express_validation_1.Joi.number().optional(),
        totalExpense: express_validation_1.Joi.number().optional(),
    })
};
exports.verifySupervisorReportSubmit = (0, express_validation_1.validate)(supervisorReportSubmitValidation);
const counterReportSubmitValidation = {
    body: express_validation_1.Joi.object({
        coachConfigId: express_validation_1.Joi.number().required(),
    })
};
exports.verifyCounterReportSubmit = (0, express_validation_1.validate)(counterReportSubmitValidation);
const supervisorReportValidation = {
    query: express_validation_1.Joi.object({
        upDate: express_validation_1.Joi.string().required(),
        downDate: express_validation_1.Joi.string().required(),
        supervisorId: express_validation_1.Joi.number().required()
    })
};
exports.verifySupervisorReport = (0, express_validation_1.validate)(supervisorReportValidation, {}, {});
const SupervisorReportAuthorizeValidation = {
    body: express_validation_1.Joi.object({
        accounts: express_validation_1.Joi.array().required().items(express_validation_1.Joi.object({
            accountId: express_validation_1.Joi.number().required(),
            amount: express_validation_1.Joi.number().required(),
        })),
    })
};
exports.verifySupervisorReportAuthorize = (0, express_validation_1.validate)(SupervisorReportAuthorizeValidation);
