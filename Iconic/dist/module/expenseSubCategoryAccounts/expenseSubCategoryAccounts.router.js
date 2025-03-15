"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const verifyParams_1 = require("../../middleware/verifyParams");
const expenseSubCategoryAccounts_validation_1 = require("./expenseSubCategoryAccounts.validation");
const expenseSubCategoryAccounts_controller_1 = require("./expenseSubCategoryAccounts.controller");
const router = (0, express_1.Router)();
router.post('/create-expense-subcategory-accounts', verifyJwt_1.verifyJwt, expenseSubCategoryAccounts_validation_1.verifyExpenseSubCategory, expenseSubCategoryAccounts_controller_1.createExpenseSubCategoryAccounts);
router.get('/get-expense-subcategory-accounts-all', verifyJwt_1.verifyJwt, expenseSubCategoryAccounts_controller_1.getExpenseSubCategoryAccountsAll);
router.get('/get-expense-subcategory-accounts-single/:id', verifyParams_1.verifyParams, verifyJwt_1.verifyJwt, expenseSubCategoryAccounts_controller_1.getExpenseSubCategoryAccountsSingle);
router.put('/update-expense-subcategory-accounts/:id', verifyParams_1.verifyParams, verifyJwt_1.verifyJwt, expenseSubCategoryAccounts_validation_1.verifyExpenseSubCategoryUpdate, expenseSubCategoryAccounts_controller_1.updateExpenseSubCategoryAccounts);
router.delete('/delete-expense-subcategory-accounts/:id', verifyParams_1.verifyParams, verifyJwt_1.verifyJwt, expenseSubCategoryAccounts_controller_1.deleteExpenseSubCategoryAccounts);
exports.default = router;
