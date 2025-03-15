"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyExpenseAccounts = void 0;
const express_validation_1 = require("express-validation");
const expenseAccountsValidation = {
    body: express_validation_1.Joi.object({
        expenseCategoryId: express_validation_1.Joi.number().required(),
        expenseSubCategoryId: express_validation_1.Joi.number().required(),
        totalAmount: express_validation_1.Joi.number().required(),
        date: express_validation_1.Joi.date().required(),
        file: express_validation_1.Joi.string().optional(),
        note: express_validation_1.Joi.string().optional(),
        payments: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
            accountId: express_validation_1.Joi.number().required(),
            paymentAmount: express_validation_1.Joi.number().required(),
        })),
    })
};
exports.verifyExpenseAccounts = (0, express_validation_1.validate)(expenseAccountsValidation);
