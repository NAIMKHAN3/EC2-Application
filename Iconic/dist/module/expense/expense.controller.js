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
exports.authorizeExpense = exports.updateExpense = exports.deleteExpense = exports.getExpenseSingle = exports.getExpenseAccountsDashboard = exports.getExpenseAll = exports.createExpense = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const { id } = req.user;
        if (data.expenseType === "Fuel") {
            if (!data.fuelCompanyId || !data.fuelWeight || !data.fuelPrice) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Fuel expense requires fuel company id fuel weight fuel price'
                });
            }
        }
        const result = yield prisma_1.default.expense.create({
            data
        });
        if (result.expenseType === "Fuel") {
            const findCoachConfig = yield prisma_1.default.coachConfig.findUnique({
                where: {
                    id: result.coachConfigId,
                }
            });
            const findDue = yield prisma_1.default.dueTable.findFirst({
                where: {
                    registrationNo: findCoachConfig === null || findCoachConfig === void 0 ? void 0 : findCoachConfig.registrationNo,
                    fuelCompanyId: result.fuelCompanyId
                }
            });
            let currentDueAmount = result.dueAmount;
            if (findDue) {
                const updateDue = yield prisma_1.default.dueTable.update({
                    where: {
                        id: findDue.id
                    },
                    data: {
                        due: {
                            increment: result.dueAmount,
                        }
                    }
                });
                currentDueAmount = updateDue.due;
            }
            else {
                yield prisma_1.default.dueTable.create({
                    data: {
                        registrationNo: findCoachConfig === null || findCoachConfig === void 0 ? void 0 : findCoachConfig.registrationNo,
                        fuelCompanyId: result.fuelCompanyId,
                        due: result.dueAmount,
                    }
                });
            }
            yield prisma_1.default.fuelPayment.create({
                data: {
                    coachConfigId: result.coachConfigId,
                    registrationNo: findCoachConfig === null || findCoachConfig === void 0 ? void 0 : findCoachConfig.registrationNo,
                    userId: id,
                    fuelCompanyId: result.fuelCompanyId,
                    date: result.date,
                    currentDueAmount,
                    expenseId: result.id,
                    paidAmount: result.paidAmount,
                    amount: result.amount,
                    fuelWeight: result.fuelWeight,
                    fuelPrice: result.fuelPrice,
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createExpense = createExpense;
const getExpenseAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { file: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.expense.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                },
                expenseCategory: {
                    select: {
                        name: true
                    }
                },
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.expense.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense retrieved Success',
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
exports.getExpenseAll = getExpenseAll;
const getExpenseAccountsDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { file: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.expense.findMany({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
            include: {
                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                },
                expenseCategory: {
                    select: {
                        name: true
                    }
                },
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.expense.count({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense retrieved Success',
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
exports.getExpenseAccountsDashboard = getExpenseAccountsDashboard;
const getExpenseSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.expense.findUnique({
            where: {
                id
            },
            include: {
                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                },
                expenseCategory: {
                    select: {
                        name: true
                    }
                },
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Expense retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getExpenseSingle = getExpenseSingle;
const deleteExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findOrder = yield prisma_1.default.expense.findUnique({
            where: {
                id
            },
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Not Found'
            });
        }
        const result = yield prisma_1.default.expense.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Expense Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteExpense = deleteExpense;
const updateExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const { id: userId } = req.user;
        const id = Number(req.params.id);
        const findExpense = yield prisma_1.default.expense.findUnique({
            where: {
                id
            },
            include: {
                FuelPayment: {
                    select: {
                        id: true,
                    }
                },
                coachConfig: {
                    select: {
                        registrationNo: true,
                    }
                }
            },
        });
        if (!findExpense) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Expense Not Found'
            });
        }
        let dueAmount = findExpense.dueAmount;
        if (!findExpense.edit) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Expense cannot be updated'
            });
        }
        if (data.expenseType === "Fuel" && !data.fuelCompanyId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Fuel expense requires fuel company id'
            });
        }
        const result = yield prisma_1.default.expense.update({
            where: {
                id
            },
            data
        });
        if (result.expenseType === "Fuel") {
            const findDue = yield prisma_1.default.dueTable.findFirst({
                where: {
                    registrationNo: findExpense.coachConfig.registrationNo,
                    fuelCompanyId: findExpense.fuelCompanyId,
                }
            });
            let currentDueAmount = result.dueAmount;
            if (findDue) {
                yield prisma_1.default.dueTable.update({
                    where: {
                        id: findDue.id,
                    },
                    data: {
                        due: {
                            decrement: dueAmount,
                        }
                    }
                });
                const updateDue = yield prisma_1.default.dueTable.update({
                    where: {
                        id: findDue.id,
                    },
                    data: {
                        due: {
                            increment: result.dueAmount,
                        }
                    }
                });
                currentDueAmount = updateDue.due;
            }
            yield prisma_1.default.fuelPayment.update({
                where: {
                    id: findExpense.FuelPayment[0].id
                },
                data: {
                    coachConfigId: result.coachConfigId,
                    userId,
                    fuelCompanyId: result.fuelCompanyId,
                    date: result.date,
                    currentDueAmount,
                    expenseId: result.id,
                    paidAmount: result.paidAmount,
                    amount: result.amount,
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateExpense = updateExpense;
const authorizeExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenseId = Number(req.params.id);
        const { edit, accounts } = req.body;
        if (edit) {
            yield prisma_1.default.expense.update({
                where: {
                    id: expenseId
                },
                data: {
                    edit: true
                }
            });
        }
        else {
            if (!accounts.length) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Accounts is required'
                });
            }
            for (let acc of accounts) {
                const findAccount = yield prisma_1.default.account.findUnique({
                    where: {
                        id: acc.accountId
                    }
                });
                if (!findAccount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Account not found'
                    });
                }
                yield prisma_1.default.account.update({
                    where: {
                        id: findAccount.id
                    },
                    data: {
                        currentBalance: {
                            increment: acc.amount
                        }
                    }
                });
            }
            const { id } = req.user;
            const findExpense = yield prisma_1.default.expense.findUnique({
                where: {
                    id: expenseId
                }
            });
            if (!findExpense) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Expense Not Found'
                });
            }
            const result = yield prisma_1.default.expense.update({
                where: {
                    id: expenseId,
                },
                data: {
                    authorizeStatus: true,
                    authorizeBy: id
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Authorize Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.authorizeExpense = authorizeExpense;
