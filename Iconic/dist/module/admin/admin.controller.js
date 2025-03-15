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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAggregationAccounts = exports.getTripNumber = exports.tripNumberWiseReport = exports.tripReport = exports.currentDueVehicle = exports.duePayment = exports.userWiseSalesReport = exports.getTodaySales = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getTodaySales = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        console.log({ startDate, endDate });
        const sales = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            include: {
                order: {
                    include: {
                        coachConfig: {
                            select: {
                                coachNo: true,
                            }
                        }
                        // coachConfig: {
                        //     include: {
                        //         route: true
                        //     }
                        // }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalSales = yield prisma_1.default.orderSeat.aggregate({
            _sum: {
                unitPrice: true,
            },
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                status: "Success",
                online: false
            },
        });
        const totalOnlineSalesAmount = yield prisma_1.default.orderSeat.aggregate({
            _sum: {
                unitPrice: true,
            },
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                status: "Success",
                online: true,
            },
        });
        const onlineHistory = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                status: "Success",
                online: true,
            },
            include: {
                order: {
                    include: {
                    // coachConfig: {
                    //     include: {
                    //         route: true
                    //     }
                    // }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const onlineHistoryCancel = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                status: "Failed",
                online: true,
            },
            include: {
                order: {
                    include: {
                    // coachConfig: {
                    //     include: {
                    //         route: true
                    //     }
                    // }
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const todaySalesHistory = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                status: "Success",
                online: false,
            },
            include: {
                order: {
                    include: {
                    // coachConfig: {
                    //     include: {
                    //         route: true
                    //     }
                    // }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const cancelHistory = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                status: "Failed",
            },
            include: {
                order: {
                    include: {
                    // coachConfig: {
                    //     include: {
                    //         route: true
                    //     }
                    // }
                    }
                },
                cancelByUser: {
                    select: {
                        userName: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        let onlineTicketCount = onlineHistory.length;
        let offlineTicketCount = todaySalesHistory.length;
        let cancelTicketCount = cancelHistory.length;
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Get Today Sales Successfully",
            data: {
                todaySales: totalSales._sum.unitPrice || 0,
                todayOnlineSales: totalOnlineSalesAmount._sum.unitPrice || 0,
                todayOnlineTicketCount: onlineTicketCount,
                todayOfflineTicketCount: offlineTicketCount,
                todayCancelTicketCount: cancelTicketCount,
                todaySalesHistory: todaySalesHistory,
                cancelHistory: cancelHistory,
                onlineHistory: onlineHistory,
                onlineHistoryCancel: onlineHistoryCancel,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTodaySales = getTodaySales;
const userWiseSalesReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, fromDate, toDate, dateType } = req.query;
    if (!userId || !fromDate || !toDate) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }
    try {
        // Fetch orders based on the filters
        const orders = yield prisma_1.default.order.findMany({
            where: {
                counterId: Number(userId),
                createdAt: {
                    gte: new Date(fromDate),
                    lte: new Date(toDate),
                },
            },
            include: {
                //   coachConfig: {
                //     include:{
                //         route: true,
                //     }
                //   },  // Include CoachConfig for coach info
                orderSeat: true, // Include orderSeat for seat details
            },
        });
        // Prepare the result set
        const reportData = orders.map(order => {
            const travelDate = order.date;
            // const coachInfo = order.coachConfig.coachNo; // Assuming `coachName` field exists in CoachConfig
            // const schedule = order.schedule;
            // const route = order.coachConfig.route.routeDirection; // Assuming `route` field exists in CoachConfig
            const soldSeatQty = order.noOfSeat;
            const complementarySeatQty = order.orderSeat.filter(seat => seat.unitPrice === 0).length;
            const grossFare = order.grossPay;
            return {
                travelDate,
                //   coachInfo,
                //   schedule,
                //   route,
                soldSeatQty,
                complementarySeatQty,
                grossFare,
            };
        });
        // Calculate total summary
        const totalSoldSeats = reportData.reduce((sum, row) => sum + row.soldSeatQty, 0);
        const totalComplementarySeats = reportData.reduce((sum, row) => sum + row.complementarySeatQty, 0);
        const totalGrossFare = reportData.reduce((sum, row) => sum + row.grossFare, 0);
        const reportSummary = {
            totalSoldSeats,
            totalComplementarySeats,
            totalGrossFare,
            records: reportData,
        };
        res.status(200).json({
            data: reportSummary
        });
    }
    catch (err) {
        next(err);
    }
});
exports.userWiseSalesReport = userWiseSalesReport;
const duePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registrationNo, fuelCompanyId, amount, payments } = req.body;
        const { id } = req.user;
        const date = (0, moment_timezone_1.default)().tz('Asia/Dhaka').format('YYYY-MM-DD');
        const findDue = yield prisma_1.default.dueTable.findFirst({
            where: {
                registrationNo,
                fuelCompanyId,
            }
        });
        if (!findDue) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'No due payment found'
            });
        }
        const updateDue = yield prisma_1.default.dueTable.update({
            where: {
                id: findDue.id,
            },
            data: {
                due: {
                    decrement: amount
                }
            }
        });
        yield prisma_1.default.fuelPayment.create({
            data: {
                registrationNo,
                fuelCompanyId,
                paidAmount: amount,
                currentDueAmount: updateDue.due,
                date,
                userId: id,
            }
        });
        for (const pay of payments) {
            yield prisma_1.default.paymentAccounts.create({
                data: {
                    userId: id,
                    accountId: pay.accountId,
                    paymentAmount: pay.paymentAmount,
                    paymentType: "Fuel",
                    paymentInOut: "OUT",
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Payment successful'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.duePayment = duePayment;
const currentDueVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registrationNo, fuelCompanyId, } = req.query;
        if (!registrationNo || !fuelCompanyId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Missing required parameters'
            });
        }
        const findDue = yield prisma_1.default.dueTable.findFirst({
            where: {
                registrationNo: registrationNo,
                fuelCompanyId: Number(fuelCompanyId),
            }
        });
        if (!findDue) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'No due payment found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Current Due',
            data: findDue
        });
    }
    catch (err) {
        next(err);
    }
});
exports.currentDueVehicle = currentDueVehicle;
const tripReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const registrationNo = req.query.registrationNo;
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const result = yield prisma_1.default.trip.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
                registrationNo: registrationNo,
                // tripStatus: "Close",
                // downDate: {
                //     not: null
                // }
            },
        });
        const data = [];
        for (const t of result) {
            if (t.coachConfigIdDownWay) {
                const upWayPassenger = yield prisma_1.default.collection.aggregate({
                    _sum: {
                        noOfPassenger: true,
                        amount: true,
                    },
                    where: {
                        coachConfigId: t.coachConfigIdUpWay
                    }
                });
                const downWayPassenger = yield prisma_1.default.collection.aggregate({
                    _sum: {
                        noOfPassenger: true,
                    },
                    where: {
                        coachConfigId: t.coachConfigIdDownWay
                    }
                });
                const newReport = Object.assign({ date: t.upDate, passengerUpWay: (upWayPassenger._sum.noOfPassenger || 0), passengerDownWay: (downWayPassenger._sum.noOfPassenger || 0), totalPassenger: (downWayPassenger._sum.noOfPassenger || 0) + (upWayPassenger._sum.noOfPassenger || 0), upWayIncome: (upWayPassenger._sum.amount || 0), downWayIncome: (upWayPassenger._sum.amount || 0) }, t);
                data.push(newReport);
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Trip Report Get Successfully',
            data: data
        });
    }
    catch (err) {
        next(err);
    }
});
exports.tripReport = tripReport;
const tripNumberWiseReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const tripNumber = Number(req.query.tripNumber);
        const findTripNumber = yield prisma_1.default.trip.findUnique({
            where: {
                id: tripNumber
            },
            include: {
                coachConfig: {
                    select: {
                        supervisorId: true,
                    }
                }
            }
        });
        if (!findTripNumber) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Trip Number Not found"
            });
        }
        const upWayDate = findTripNumber.upDate;
        const downWayDate = findTripNumber.downDate;
        const supervisor = Number(findTripNumber.coachConfig.supervisorId);
        const findUpWayCoach = yield prisma_1.default.coachConfig.findFirst({
            where: {
                departureDate: upWayDate,
                supervisorId: supervisor,
            },
            include: {
                route: {
                    select: {
                        routeName: true,
                    }
                },
                fare: {
                    select: {
                        amount: true,
                    }
                },
                supervisor: {
                    select: {
                        userName: true,
                        contactNo: true,
                    }
                },
                driver: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                }
            }
        });
        const findDownWayCoach = yield prisma_1.default.coachConfig.findFirst({
            where: {
                departureDate: downWayDate,
                supervisorId: supervisor,
            },
            include: {
                route: {
                    select: {
                        routeName: true,
                    }
                },
                supervisor: {
                    select: {
                        userName: true,
                        contactNo: true,
                    }
                },
                driver: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                    }
                }
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
        console.log(upWayDate);
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
            var _a, _b, _c;
            totalUpIncome += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.name,
                counterMasterName: (_b = col.counter) === null || _b === void 0 ? void 0 : _b.primaryContactPersonName,
                noOfPassenger: col.noOfPassenger,
                fare: (_c = findUpWayCoach.fare) === null || _c === void 0 ? void 0 : _c.amount,
                amount: col.amount,
                routeDirection: col.routeDirection
            };
        });
        const upWayOthersIncomeReport = findOthersIncomeUpWay.map(col => {
            var _a;
            othersIncomeUpWay += col.amount;
            return {
                counterName: "N/A",
                counterMasterName: "N/A",
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                fare: (_a = findUpWayCoach.fare) === null || _a === void 0 ? void 0 : _a.amount,
                amount: col.amount,
            };
        });
        const downWayOthersIncomeReport = findOthersIncomeDownWay.map(col => {
            var _a;
            othersIncomeDownWay += col.amount;
            return {
                counterName: "N/A",
                counterMasterName: "N/A",
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                fare: (_a = findUpWayCoach.fare) === null || _a === void 0 ? void 0 : _a.amount,
                amount: col.amount,
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
            var _a, _b, _c;
            totalDownIncome += col.amount;
            return {
                counterName: (_a = col.counter) === null || _a === void 0 ? void 0 : _a.name,
                counterMasterName: (_b = col.counter) === null || _b === void 0 ? void 0 : _b.primaryContactPersonName,
                routeDirection: col.routeDirection,
                noOfPassenger: col.noOfPassenger,
                fare: (_c = findUpWayCoach.fare) === null || _c === void 0 ? void 0 : _c.amount,
                amount: col.amount,
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
                upWayCoachInfo: findUpWayCoach,
                downWayCoachInfo: findDownWayCoach,
                totalIncome: totalDownIncome + totalUpIncome,
                // upWayCoachConfigId: upWayCoachConfigId,
                // downWayCoachConfigId: downWayCoachConfigId,
                // upWayTripNo: findUpWayCoach.tripNo,
                // downWayTripNo: findDownWayCoach.tripNo,
                totalAmount: (totalDownIncome + totalUpIncome) - totalExpense,
                totalUpIncome,
                gp: findTripNumber.gp,
                totalDownIncome,
                totalExpense,
                totalUpOpeningBalance,
                totalDownOpeningBalance,
                othersIncomeUpWay,
                othersIncomeDownWay,
                collectionReport: [...upWayCollectionReport, ...downWayCollectionReport, ...upWayOthersIncomeReport, ...downWayOthersIncomeReport],
                expenseReport: [...expenseUpWayReport, ...expenseDownWayReport]
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.tripNumberWiseReport = tripNumberWiseReport;
const getTripNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setHours(23, 59, 59, 999);
        const result = yield prisma_1.default.trip.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
            },
            select: {
                id: true
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Trip Number Get Successfully',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTripNumber = getTripNumber;
const getAggregationAccounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const receivedAmount = yield prisma_1.default.paymentAccounts.aggregate({
            _sum: {
                paymentAmount: true,
            },
            where: {
                paymentInOut: "IN",
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]
            },
        });
        const paymentAmount = yield prisma_1.default.paymentAccounts.aggregate({
            _sum: {
                paymentAmount: true,
            },
            where: {
                paymentType: "Fuel",
                paymentInOut: "OUT",
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]
            },
        });
        const expenseAmount = yield prisma_1.default.paymentAccounts.aggregate({
            _sum: {
                paymentAmount: true,
            },
            where: {
                paymentType: "Expense",
                paymentInOut: "IN",
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ]
            },
        });
        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Aggregation Accounts Get Successfully',
            data: {
                receivedAmount: (receivedAmount._sum.paymentAmount || 0),
                paymentAmount: (paymentAmount._sum.paymentAmount || 0),
                expenseAmount: (expenseAmount._sum.paymentAmount || 0),
                cashOnHand: ((receivedAmount._sum.paymentAmount || 0) - (paymentAmount._sum.paymentAmount || 0)) - (expenseAmount._sum.paymentAmount || 0)
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAggregationAccounts = getAggregationAccounts;
