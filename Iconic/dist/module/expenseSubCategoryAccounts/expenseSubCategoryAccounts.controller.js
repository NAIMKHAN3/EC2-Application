"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpenseSubCategoryAccounts = exports.updateExpenseSubCategoryAccounts = exports.getExpenseSubCategoryAccountsSingle = exports.getExpenseSubCategoryAccountsAll = exports.createExpenseSubCategoryAccounts = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createExpenseSubCategoryAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const findCategory = yield prisma_1.default.expenseSubCategoryAccounts.findFirst({
            where: {
                expenseCategoryId: data.expenseCategoryId,
                name: data.name
            }
        });
        if (findCategory) {
            return res.status(400).send({
                success: false,
                statusCode: 200,
                message: 'Expense Sub Category Accounts Name already exists',
            });
        }
        const result = yield prisma_1.default.expenseSubCategoryAccounts.create({
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Sub Category Accounts Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createExpenseSubCategoryAccounts = createExpenseSubCategoryAccounts;
const getExpenseSubCategoryAccountsAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page) - 1 || 0;
        const take = parseInt(size) || 10;
        const whereCondition = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.expenseSubCategoryAccounts.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.expenseSubCategoryAccounts.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Sub Category Accounts retrieved Success',
            meta: {
                page: skip,
                size: take,
                total,
                totalPage: Math.ceil(total / take)
            },
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getExpenseSubCategoryAccountsAll = getExpenseSubCategoryAccountsAll;
const getExpenseSubCategoryAccountsSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.expenseSubCategoryAccounts.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Sub Category Accounts Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Expense Sub Category Accounts retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getExpenseSubCategoryAccountsSingle = getExpenseSubCategoryAccountsSingle;
const updateExpenseSubCategoryAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.expenseSubCategoryAccounts.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            message: "Expense Sub Category Accounts Update Success",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateExpenseSubCategoryAccounts = updateExpenseSubCategoryAccounts;
const deleteExpenseSubCategoryAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.expenseSubCategoryAccounts.delete({ where: { id: Number(req.params.id) } });
        res.status(200).send({
            success: true,
            message: "Expense Sub Category Accounts Delete Success",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteExpenseSubCategoryAccounts = deleteExpenseSubCategoryAccounts;
