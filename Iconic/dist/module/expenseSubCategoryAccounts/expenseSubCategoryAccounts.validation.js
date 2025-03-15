"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyExpenseSubCategoryUpdate = exports.verifyExpenseSubCategory = void 0;
const express_validation_1 = require("express-validation");
const expenseSubCategoryValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        expenseCategoryId: express_validation_1.Joi.number().required(),
    })
};
exports.verifyExpenseSubCategory = (0, express_validation_1.validate)(expenseSubCategoryValidation);
const expenseSubCategoryUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
        expenseCategoryId: express_validation_1.Joi.number().required(),
    })
};
exports.verifyExpenseSubCategoryUpdate = (0, express_validation_1.validate)(expenseSubCategoryUpdateValidation);
