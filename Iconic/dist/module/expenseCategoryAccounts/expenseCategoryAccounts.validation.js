"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyExpenseCategoryUpdate = exports.verifyExpenseCategory = void 0;
const express_validation_1 = require("express-validation");
const expenseCategoryValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyExpenseCategory = (0, express_validation_1.validate)(expenseCategoryValidation);
const expenseCategoryUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifyExpenseCategoryUpdate = (0, express_validation_1.validate)(expenseCategoryUpdateValidation);
