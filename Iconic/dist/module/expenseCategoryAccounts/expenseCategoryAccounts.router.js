"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseCategoryAccounts_validation_1 = require("./expenseCategoryAccounts.validation");
const expenseCategoryAccounts_controller_1 = require("./expenseCategoryAccounts.controller");
const router = (0, express_1.Router)();
router.post('/create-expense-category-accounts', expenseCategoryAccounts_validation_1.verifyExpenseCategory, expenseCategoryAccounts_controller_1.createExpenseCategoryAccounts);
router.put('/update-expense-category-accounts/:id', expenseCategoryAccounts_validation_1.verifyExpenseCategoryUpdate, expenseCategoryAccounts_controller_1.updateExpenseCategoryAccounts);
router.get('/get-expense-category-accounts-all', expenseCategoryAccounts_controller_1.getExpenseCategoryAccountsAll);
router.get('/get-expense-category-accounts-single/:id', expenseCategoryAccounts_controller_1.getExpenseCategoryAccountsSingle);
router.delete('/delete-expense-category-accounts/:id', expenseCategoryAccounts_controller_1.deleteExpenseCategoryAccounts);
exports.default = router;
