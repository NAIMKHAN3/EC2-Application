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
exports.authorizeCounterReportSubmit = exports.getCounterReportSubmit = exports.counterReportSubmit = exports.detailsSupervisorReportSubmit = exports.getSupervisorReportSubmit = exports.authorizeSupervisorReportSubmit = exports.createSupervisorReportSubmit = exports.supervisorDashboardReport = exports.updateUser = exports.deleteUser = exports.getUserById = exports.getUserAll = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getUserAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { userName: { contains: search, } },
                    { email: { contains: search, } },
                    { contactNo: { contains: search, } },
                    { address: { contains: search, } },
                ],
            });
        }
        [];
        let total = 0;
        let result = yield prisma_1.default.user.findMany({
            where: {
                AND: whereCondition,
            },
            select: {
                id: true,
                userName: true,
                contactNo: true,
                active: true,
                role: true,
                avatar: true,
            },
            skip: skip * take,
            take,
        });
        total = yield prisma_1.default.user.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get User All Successfully',
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
exports.getUserAll = getUserAll;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.user.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                contactNo: true,
                address: true,
                counter: true,
                active: true,
                avatar: true,
                dateOfBirth: true,
                maritalStatus: true,
                gender: true,
                bloodGroup: true,
            }
        });
        res.status(200).send({
            success: true,
            message: "Get User Success",
            statusCode: 200,
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.user.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).send({
            success: true,
            message: "User Delete Success",
            statusCode: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.user.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "User Updated Success",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
const supervisorDashboardReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { upDate, downDate, supervisorId } = req.query;
        const upWayDate = upDate;
        const downWayDate = downDate;
        const supervisor = Number(supervisorId);
        const findUpWayCoach = yield prisma_1.default.coachConfig.findFirst({
            where: {
                departureDate: upWayDate,
                supervisorId: supervisor,
            }
        });
        const findDownWayCoach = yield prisma_1.default.coachConfig.findFirst({
            where: {
                departureDate: downWayDate,
                supervisorId: supervisor,
            }
        });
        if (!findUpWayCoach || !findDownWayCoach) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Coach Config Not found"
            });
        }
        let upWayCoachConfigId = findUpWayCoach.id;
        let downWayCoachConfigId = findDownWayCoach.id;
        let totalUpOpeningBalance = 0;
        let totalDownOpeningBalance = 0;
        let totalUpIncome = 0;
        let totalDownIncome = 0;
        let totalExpense = 0;
        let othersIncomeUpWay = 0;
        let othersIncomeDownWay = 0;
        const findOthersIncomeUpWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        });
        const findOthersIncomeDownWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        });
        const findCollectionUpWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        });
        const findCollectionDownWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        });
        const findOpeningBalanceUpWay = yield prisma_1.default.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        });
        const findOpeningBalanceDownWay = yield prisma_1.default.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        });
        const findExpenseUpWay = yield prisma_1.default.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
            },
            include: {
                expenseCategory: true,
            }
        });
        const findExpenseDownWay = yield prisma_1.default.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
            },
            include: {
                expenseCategory: true,
            }
        });
        const upWayCollectionReport = findCollectionUpWay.map(col => {
            var _a;
            totalUpIncome += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection
            };
        });
        const upWayOthersIncomeReport = findOthersIncomeUpWay.map(col => {
            var _a;
            othersIncomeUpWay += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
            };
        });
        const downWayOthersIncomeReport = findOthersIncomeDownWay.map(col => {
            var _a;
            othersIncomeDownWay += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
            };
        });
        totalUpOpeningBalance += (findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.amount) || 0;
        const upWayOpeningBalanceReport = {
            counterName: (_a = findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.counter) === null || _a === void 0 ? void 0 : _a.address,
            amount: findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.amount,
            routeDirection: findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.routeDirection
        };
        totalDownOpeningBalance += (findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.amount) || 0;
        const downWayOpeningBalanceReport = {
            counterName: (_b = findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.counter) === null || _b === void 0 ? void 0 : _b.address,
            amount: findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.amount,
            routeDirection: findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.routeDirection
        };
        const downWayCollectionReport = findCollectionDownWay.map(col => {
            var _a;
            totalDownIncome += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection
            };
        });
        const expenseUpWayReport = findExpenseUpWay.map(ex => {
            var _a;
            upWayCoachConfigId = ex.coachConfigId;
            totalExpense += ex.amount;
            return {
                expenseCategory: (_a = ex.expenseCategory) === null || _a === void 0 ? void 0 : _a.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection
            };
        });
        const expenseDownWayReport = findExpenseDownWay.map(ex => {
            var _a;
            downWayCoachConfigId = ex.coachConfigId;
            totalExpense += ex.amount;
            return {
                expenseCategory: (_a = ex.expenseCategory) === null || _a === void 0 ? void 0 : _a.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection
            };
        });
        console.log(upWayCoachConfigId, downWayCoachConfigId);
        res.status(200).send({
            success: true,
            message: "Supervisor reported success!",
            statusCode: 200,
            data: {
                upDate,
                downDate,
                upWayCoachConfigId: upWayCoachConfigId,
                downWayCoachConfigId: downWayCoachConfigId,
                upWayTripNo: findUpWayCoach.tripNo,
                downWayTripNo: findDownWayCoach.tripNo,
                totalUpIncome,
                totalDownIncome,
                totalExpense,
                totalUpOpeningBalance,
                totalDownOpeningBalance,
                othersIncomeUpWay,
                othersIncomeDownWay,
                upWayCollectionReport,
                downWayCollectionReport,
                upWayOpeningBalanceReport,
                downWayOpeningBalanceReport,
                upWayOthersIncomeReport,
                downWayOthersIncomeReport,
                expenseReport: [...expenseUpWayReport, ...expenseDownWayReport]
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.supervisorDashboardReport = supervisorDashboardReport;
const createSupervisorReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const data = __rest(req.body, []);
        data.supervisorId = id;
        const findReport = yield prisma_1.default.supervisorReportSubmit.findFirst({
            where: {
                supervisorId: id,
                upWayCoachConfigId: data.upWayCoachConfigId,
                downWayCoachConfigId: data.downWayCoachConfigId,
            }
        });
        // if (findReport) {
        //     return res.status(400).send({
        //         success: false,
        //         statusCode: 400,
        //         message: "Supervisor Report Already Submitted!"
        //     })
        // }
        const supervisorReport = yield prisma_1.default.supervisorReportSubmit.create({ data });
        const findUpWayCoach = yield prisma_1.default.coachConfig.findUnique({
            where: {
                id: supervisorReport.upWayCoachConfigId,
            }
        });
        const findDownWayCoach = yield prisma_1.default.coachConfig.findUnique({
            where: {
                id: supervisorReport.upWayCoachConfigId,
            }
        });
        const totalCollectionUpWay = yield prisma_1.default.collection.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalExpenseUpWay = yield prisma_1.default.expense.aggregate({
            _sum: {
                paidAmount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalCollectionDownWay = yield prisma_1.default.collection.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalExpenseDownWay = yield prisma_1.default.expense.aggregate({
            _sum: {
                paidAmount: true,
            },
            where: {
                date: supervisorReport.upWayDate,
                coachConfigId: supervisorReport.upWayCoachConfigId,
            },
        });
        const totalUpWayIncome = totalCollectionUpWay._sum.amount;
        const totalUpWayExpense = totalExpenseUpWay._sum.paidAmount;
        const totalDownWayIncome = totalCollectionDownWay._sum.amount;
        const totalDownWayExpense = totalExpenseDownWay._sum.paidAmount;
        yield prisma_1.default.trip.update({
            where: {
                id: findUpWayCoach === null || findUpWayCoach === void 0 ? void 0 : findUpWayCoach.tripNo
            },
            data: {
                totalIncome: {
                    increment: totalUpWayIncome || 0,
                },
                totalExpense: {
                    increment: totalUpWayExpense || 0,
                },
                cashOnHand: {
                    increment: (totalUpWayIncome || 0) - (totalUpWayExpense || 0),
                },
                tripStatus: "Close"
            }
        });
        yield prisma_1.default.trip.update({
            where: {
                id: findDownWayCoach === null || findDownWayCoach === void 0 ? void 0 : findDownWayCoach.tripNo
            },
            data: {
                totalIncome: {
                    increment: totalDownWayIncome || 0,
                },
                totalExpense: {
                    increment: totalDownWayExpense || 0,
                },
                cashOnHand: {
                    increment: (totalDownWayIncome || 0) - (totalDownWayExpense || 0),
                },
                tripStatus: "Close"
            }
        });
        res.status(200).send({
            success: true,
            message: "Supervisor Report Submit Success!",
            statusCode: 200,
            data: supervisorReport
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createSupervisorReportSubmit = createSupervisorReportSubmit;
const authorizeSupervisorReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const reportId = Number(req.params.id);
        const data = __rest(req.body, []);
        let cashOnHand = 0;
        for (const payment of data.accounts) {
            cashOnHand += payment.amount;
        }
        const findReport = yield prisma_1.default.supervisorReportSubmit.findUnique({
            where: {
                id: reportId
            }
        });
        if (!findReport) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Report Not Found!"
            });
        }
        if (cashOnHand !== findReport.cashOnHand) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "cash on hand not match!"
            });
        }
        const supervisorReport = yield prisma_1.default.supervisorReportSubmit.update({
            where: {
                id: reportId
            },
            data: {
                authorize: id,
                authorizeStatus: true,
            }
        });
        for (const payment of data.accounts) {
            yield prisma_1.default.account.update({
                where: {
                    id: payment.accountId
                },
                data: {
                    currentBalance: {
                        increment: payment.amount
                    }
                }
            });
        }
        yield prisma_1.default.collection.updateMany({
            where: {
                coachConfigId: findReport.upWayCoachConfigId,
            },
            data: {
                authorizeBy: id,
                authorizeStatus: true,
                edit: false
            }
        });
        yield prisma_1.default.collection.updateMany({
            where: {
                coachConfigId: findReport.downWayCoachConfigId,
            },
            data: {
                authorizeBy: id,
                authorizeStatus: true,
                edit: false
            }
        });
        for (const pay of data.accounts) {
            yield prisma_1.default.paymentAccounts.create({
                data: {
                    userId: id,
                    accountId: pay.accountId,
                    paymentAmount: pay.amount,
                    paymentType: "Supervisor",
                    paymentInOut: "IN",
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Authorize Supervisor Report Success!",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.authorizeSupervisorReportSubmit = authorizeSupervisorReportSubmit;
const getSupervisorReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const result = yield prisma_1.default.supervisorReportSubmit.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            include: {
                supervisor: {
                    select: {
                        userName: true,
                    },
                },
                upWayCoach: {
                    select: {
                        coach: true,
                        registrationNo: true,
                    }
                },
                downWayCoach: {
                    select: {
                        coach: true,
                        registrationNo: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "All Supervisor Report Submit retrieved Success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getSupervisorReportSubmit = getSupervisorReportSubmit;
const detailsSupervisorReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        const id = Number(req.params.id);
        const findReport = yield prisma_1.default.supervisorReportSubmit.findUnique({
            where: {
                id: id,
            },
            include: {
                authorizeBy: {
                    select: {
                        userName: true,
                    }
                }
            }
        });
        if (!findReport) {
            return res.status(404).send({
                success: false,
                message: "Supervisor Report not found",
                statusCode: 404,
            });
        }
        const upWayDate = findReport.upWayDate;
        const downWayDate = findReport.downWayDate;
        const supervisor = findReport.supervisorId;
        let totalUpOpeningBalance = 0;
        let totalDownOpeningBalance = 0;
        let totalUpIncome = 0;
        let totalDownIncome = 0;
        let totalExpense = 0;
        let othersIncomeUpWay = 0;
        let othersIncomeDownWay = 0;
        const findOthersIncomeUpWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        });
        const findOthersIncomeDownWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: upWayDate,
                collectionType: "OthersIncome"
            },
            include: {
                counter: true,
            }
        });
        const findCollectionUpWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        });
        const findCollectionDownWay = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "CounterCollection"
            },
            include: {
                counter: true,
            }
        });
        const findOpeningBalanceUpWay = yield prisma_1.default.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        });
        const findOpeningBalanceDownWay = yield prisma_1.default.collection.findFirst({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
                collectionType: "OpeningBalance"
            },
            include: {
                counter: true,
            }
        });
        const findExpenseUpWay = yield prisma_1.default.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Up_Way",
                date: upWayDate,
            },
            include: {
                expenseCategory: true,
            }
        });
        const findExpenseDownWay = yield prisma_1.default.expense.findMany({
            where: {
                supervisorId: supervisor,
                routeDirection: "Down_Way",
                date: downWayDate,
            },
            include: {
                expenseCategory: true,
            }
        });
        const upWayCollectionReport = findCollectionUpWay.map(col => {
            var _a;
            totalUpIncome += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                file: col.file,
            };
        });
        const upWayOthersIncomeReport = findOthersIncomeUpWay.map(col => {
            var _a;
            othersIncomeUpWay += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                file: col.file,
            };
        });
        const downWayOthersIncomeReport = findOthersIncomeDownWay.map(col => {
            var _a;
            othersIncomeDownWay += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                file: col.file,
            };
        });
        totalUpOpeningBalance += (findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.amount) || 0;
        const upWayOpeningBalanceReport = {
            counterName: (_c = findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.counter) === null || _c === void 0 ? void 0 : _c.address,
            amount: findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.amount,
            routeDirection: findOpeningBalanceUpWay === null || findOpeningBalanceUpWay === void 0 ? void 0 : findOpeningBalanceUpWay.routeDirection
        };
        totalDownOpeningBalance += (findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.amount) || 0;
        const downWayOpeningBalanceReport = {
            counterName: (_d = findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.counter) === null || _d === void 0 ? void 0 : _d.address,
            amount: findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.amount,
            routeDirection: findOpeningBalanceDownWay === null || findOpeningBalanceDownWay === void 0 ? void 0 : findOpeningBalanceDownWay.routeDirection
        };
        const downWayCollectionReport = findCollectionDownWay.map(col => {
            var _a;
            totalDownIncome += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.address,
                amount: col.amount,
                routeDirection: col.routeDirection,
                file: col.file,
            };
        });
        const expenseUpWayReport = findExpenseUpWay.map(ex => {
            var _a;
            totalExpense += ex.amount;
            return {
                expenseCategory: (_a = ex.expenseCategory) === null || _a === void 0 ? void 0 : _a.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection,
                file: ex.file,
            };
        });
        const expenseDownWayReport = findExpenseDownWay.map(ex => {
            var _a;
            totalExpense += ex.amount;
            return {
                expenseCategory: (_a = ex.expenseCategory) === null || _a === void 0 ? void 0 : _a.name,
                amount: ex.amount,
                routeDirection: ex.routeDirection,
                file: ex.file,
            };
        });
        res.status(200).send({
            success: true,
            message: "Supervisor reported success!",
            statusCode: 200,
            data: {
                report: findReport,
                upWayCoachConfigId: findCollectionUpWay.length ? (_e = findCollectionUpWay[0]) === null || _e === void 0 ? void 0 : _e.coachConfigId : null,
                downWayCoachConfigId: findCollectionDownWay.length ? (_f = findCollectionDownWay[0]) === null || _f === void 0 ? void 0 : _f.coachConfigId : null,
                totalUpIncome,
                totalDownIncome,
                totalExpense,
                totalUpOpeningBalance,
                totalDownOpeningBalance,
                othersIncomeUpWay,
                othersIncomeDownWay,
                upWayCollectionReport,
                downWayCollectionReport,
                upWayOpeningBalanceReport,
                downWayOpeningBalanceReport,
                upWayOthersIncomeReport,
                downWayOthersIncomeReport,
                expenseReport: [...expenseUpWayReport, ...expenseDownWayReport]
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.detailsSupervisorReportSubmit = detailsSupervisorReportSubmit;
const counterReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, counterId } = req.user;
        const { coachConfigId } = req.body;
        const findCoachConfig = yield prisma_1.default.coachConfig.findUnique({
            where: {
                id: coachConfigId
            }
        });
        const findCounterReportSubmit = yield prisma_1.default.counterReportSubmit.findFirst({
            where: {
                coachConfigId: coachConfigId,
                counterId,
            }
        });
        if (!findCoachConfig) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Config Not Found'
            });
        }
        if (findCounterReportSubmit) {
            return res.status(404).send({
                success: false,
                statusCode: 400,
                message: 'This Counter Report Already Submitted!'
            });
        }
        const report = yield prisma_1.default.order.aggregate({
            _sum: {
                noOfSeat: true,
                amount: true,
            },
            where: {
                coachConfigId: findCoachConfig.id,
                counterId: counterId,
            }
        });
        yield prisma_1.default.counterReportSubmit.create({
            data: {
                userId: id,
                counterId: counterId,
                tripNo: findCoachConfig.tripNo,
                coachConfigId: findCoachConfig.id,
                date: findCoachConfig.departureDate,
                totalPassenger: report._sum.noOfSeat || 0,
                amount: report._sum.amount || 0,
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Report Submit Success'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.counterReportSubmit = counterReportSubmit;
const getCounterReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const result = yield prisma_1.default.counterReportSubmit.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            include: {
                authorizeBy: {
                    select: {
                        userName: true,
                    },
                },
                coachConfig: {
                    select: {
                        coach: true,
                        registrationNo: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "All Counter Report Submit retrieved Success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCounterReportSubmit = getCounterReportSubmit;
const authorizeCounterReportSubmit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const reportId = Number(req.params.id);
        const data = __rest(req.body, []);
        let totalAmount = 0;
        for (const payment of data.accounts) {
            totalAmount += payment.amount;
        }
        const findReport = yield prisma_1.default.counterReportSubmit.findUnique({
            where: {
                id: reportId
            }
        });
        if (!findReport) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Report Not Found!"
            });
        }
        // if (findReport.authorizeStatus) {
        //     return res.status(400).send({
        //         success: false,
        //         statusCode: 400,
        //         message: "Already This Report Authorized!"
        //     })
        // }
        if (totalAmount !== findReport.amount) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Total Amount not match!"
            });
        }
        const supervisorReport = yield prisma_1.default.counterReportSubmit.update({
            where: {
                id: reportId
            },
            data: {
                authorize: id,
                authorizeStatus: true,
            }
        });
        for (const payment of data.accounts) {
            yield prisma_1.default.account.update({
                where: {
                    id: payment.accountId
                },
                data: {
                    currentBalance: {
                        increment: payment.amount
                    }
                }
            });
        }
        for (const pay of data.accounts) {
            yield prisma_1.default.paymentAccounts.create({
                data: {
                    userId: id,
                    accountId: pay.accountId,
                    paymentAmount: pay.amount,
                    paymentType: "Counter",
                    paymentInOut: "IN",
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Authorize Counter Report Success!",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.authorizeCounterReportSubmit = authorizeCounterReportSubmit;
