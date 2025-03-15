"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyExpenseAuthorize = exports.verifyExpenseUpdate = exports.verifyExpense = void 0;
const express_validation_1 = require("express-validation");
const expenseValidation = {
    body: express_validation_1.Joi.object({
        expenseType: express_validation_1.Joi.string().required().valid("Fuel", "Others"),
        fuelCompanyId: express_validation_1.Joi.number().optional(),
        coachConfigId: express_validation_1.Joi.number().required(),
        supervisorId: express_validation_1.Joi.number().required(),
        expenseCategoryId: express_validation_1.Joi.number().required(),
        routeDirection: express_validation_1.Joi.string().required().valid("Up_Way", "Down_Way"),
        amount: express_validation_1.Joi.number().required(),
        paidAmount: express_validation_1.Joi.number().required(),
        dueAmount: express_validation_1.Joi.number().required(),
        fuelWeight: express_validation_1.Joi.number().optional(),
        fuelPrice: express_validation_1.Joi.number().optional(),
        date: express_validation_1.Joi.string().required(),
        file: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyExpense = (0, express_validation_1.validate)(expenseValidation);
const expenseUpdateValidation = {
    body: express_validation_1.Joi.object({
        fuelCompanyId: express_validation_1.Joi.number().optional(),
        coachConfigId: express_validation_1.Joi.number().optional(),
        supervisorId: express_validation_1.Joi.number().optional(),
        expenseCategoryId: express_validation_1.Joi.number().optional(),
        routeDirection: express_validation_1.Joi.string().optional().valid("Up_Way", "Down_Way"),
        amount: express_validation_1.Joi.number().optional(),
        paidAmount: express_validation_1.Joi.number().optional(),
        dueAmount: express_validation_1.Joi.number().optional(),
        fuelWeight: express_validation_1.Joi.number().optional(),
        fuelPrice: express_validation_1.Joi.number().optional(),
        date: express_validation_1.Joi.optional().optional(),
        file: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyExpenseUpdate = (0, express_validation_1.validate)(expenseUpdateValidation);
const expenseAuthorizeValidation = {
    body: express_validation_1.Joi.object({
        edit: express_validation_1.Joi.boolean().required(),
        accounts: express_validation_1.Joi.array().optional().items(express_validation_1.Joi.object({
            accountId: express_validation_1.Joi.number().required(),
            amount: express_validation_1.Joi.number().required(),
        })),
    })
};
exports.verifyExpenseAuthorize = (0, express_validation_1.validate)(expenseAuthorizeValidation);
