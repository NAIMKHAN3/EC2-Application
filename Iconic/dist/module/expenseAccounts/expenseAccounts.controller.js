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
exports.expenseAccountsReport = exports.getExpenseAccountsAll = exports.deleteExpenseAccounts = exports.getExpenseAccountsById = exports.updateExpenseAccounts = exports.createExpenseAccounts = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createExpenseAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const _a = req.body, { payments } = _a, data = __rest(_a, ["payments"]);
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // data.expenseCategoryAccountsId = data.expenseCategoryId;
            // data.expenseSubCategoryAccountsId = data.expenseSubcategoryId;
            data.userId = id;
            console.log(data);
            const result = yield prisma.expenseAccounts.create({ data });
            if (result) {
                if (payments === null || payments === void 0 ? void 0 : payments.length) {
                    for (const payment of payments) {
                        const paymentResult = yield prisma.paymentAccounts.create({
                            data: {
                                userId: id,
                                accountId: payment.accountId,
                                paymentAmount: payment.paymentAmount,
                                expenseAccountId: result.id,
                                paymentType: "Expense",
                                paymentInOut: "OUT",
                            },
                        });
                        const accountId = payment.accountId;
                        if (accountId) {
                            const findAccount = yield prisma.account.findUnique({
                                where: {
                                    id: accountId
                                }
                            });
                            if (findAccount) {
                                let newBalance = (findAccount === null || findAccount === void 0 ? void 0 : findAccount.currentBalance) - payment.paymentAmount;
                                yield prisma.account.update({
                                    where: {
                                        id: accountId
                                    },
                                    data: {
                                        currentBalance: newBalance
                                    }
                                });
                            }
                        }
                    }
                }
            }
            return result;
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(201).send({
            success: true,
            message: "Expense Accounts Create Success",
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createExpenseAccounts = createExpenseAccounts;
const updateExpenseAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.expenseAccounts.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            message: "ExpenseAccounts Update Success",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateExpenseAccounts = updateExpenseAccounts;
const getExpenseAccountsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.expenseAccounts.findFirst({
            where: { id: Number(req.params.id) },
            include: {
                expenseCategoryAccount: true,
                expenseSubCategoryAccount: true,
                PaymentAccounts: {
                    include: {
                        account: true
                    }
                },
            },
        });
        res.status(200).send({
            success: true,
            message: "Expense Accounts Get Success",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getExpenseAccountsById = getExpenseAccountsById;
const deleteExpenseAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findExpenseAccounts = yield prisma_1.default.expenseAccounts.findUnique({
            where: {
                id: id
            }
        });
        if (!findExpenseAccounts) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "Expense Accounts not found",
            });
        }
        const payments = yield prisma_1.default.paymentAccounts.findMany({
            where: {
                expenseAccountId: id
            }
        });
        if (payments.length) {
            for (const p of payments) {
                const findAccount = yield prisma_1.default.account.findUnique({
                    where: {
                        id: p.accountId
                    }
                });
                if (!findAccount) {
                    return res.status(404).send({
                        success: false,
                        statusCode: 404,
                        message: "Account not found",
                    });
                }
                const newBalance = findAccount.currentBalance + p.paymentAmount;
                yield prisma_1.default.account.update({
                    where: {
                        id: p.accountId
                    },
                    data: {
                        currentBalance: newBalance
                    }
                });
            }
        }
        yield prisma_1.default.paymentAccounts.deleteMany({
            where: {
                expenseAccountId: id
            }
        });
        const result = yield prisma_1.default.expenseAccounts.delete({ where: { id } });
        res.status(200).send({
            success: true,
            message: "Expense Accounts Delete Success",
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteExpenseAccounts = deleteExpenseAccounts;
const getExpenseAccountsAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page) - 1) || 0;
        const take = (parseInt(size)) || 10;
        const order = (sortOrder === null || sortOrder === void 0 ? void 0 : sortOrder.toLowerCase()) === 'desc' ? 'desc' : 'asc';
        const whereCondition = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { date: { contains: search, } },
                ],
            });
        }
        let result = yield prisma_1.default.expenseAccounts.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                expenseCategoryAccount: true,
                expenseSubCategoryAccount: true,
                PaymentAccounts: {
                    include: {
                        account: true
                    }
                },
            },
            skip: skip * take,
            take,
            orderBy: {
                createdAt: 'desc',
            },
        });
        const total = yield prisma_1.default.expenseAccounts.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Accounts Get All Successfully',
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
exports.getExpenseAccountsAll = getExpenseAccountsAll;
const expenseAccountsReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const categoryId = Number(req.query.category);
        const subcategoryId = Number(req.query.subcategory);
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        let result;
        let total;
        if (!Number.isNaN(categoryId) && Number.isNaN(subcategoryId)) {
            result = yield prisma_1.default.expenseAccounts.findMany({
                where: {
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = yield prisma_1.default.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
            });
        }
        else if (Number.isNaN(categoryId) && !Number.isNaN(subcategoryId)) {
            result = yield prisma_1.default.expenseAccounts.findMany({
                where: {
                    expenseSubCategoryId: subcategoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = yield prisma_1.default.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    expenseSubCategoryId: subcategoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
            });
        }
        else if (!Number.isNaN(categoryId) && !Number.isNaN(subcategoryId)) {
            result = yield prisma_1.default.expenseAccounts.findMany({
                where: {
                    expenseSubCategoryId: subcategoryId,
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = yield prisma_1.default.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    expenseSubCategoryId: subcategoryId,
                    expenseCategoryId: categoryId,
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
            });
        }
        else if (Number.isNaN(categoryId) && Number.isNaN(subcategoryId)) {
            result = yield prisma_1.default.expenseAccounts.findMany({
                where: {
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
                include: {
                    expenseCategoryAccount: true,
                    expenseSubCategoryAccount: true
                }
            });
            total = yield prisma_1.default.expenseAccounts.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    AND: [
                        { createdAt: { gte: startDate } },
                        { createdAt: { lte: endDate } }
                    ]
                },
            });
        }
        res.status(200).send({
            success: true,
            message: "Get ExpenseAccounts Report Successfully",
            totalAmount: (_b = total === null || total === void 0 ? void 0 : total._sum) === null || _b === void 0 ? void 0 : _b.totalAmount,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.expenseAccountsReport = expenseAccountsReport;
