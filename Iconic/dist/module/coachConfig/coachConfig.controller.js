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
exports.coachReportSuperVisor = exports.updateCoachConfig = exports.deleteCoachConfig = exports.getCoachConfigSingle = exports.getTodayCoachList = exports.getCoachList = exports.getCoachConfigUpdate = exports.getCoachConfigAll = exports.createCoachConfig = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const order_controller_1 = require("../order/order.controller");
const date_fns_1 = require("date-fns");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function deleteCounterBookedSeatsLessThan2Hours(coachConfigId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const coachConfig = yield prisma_1.default.coachConfig.findUnique({
                where: { id: coachConfigId },
                select: {
                    departureDate: true,
                    schedule: true,
                },
            });
            if (!coachConfig) {
                console.log("CoachConfig not found");
                return;
            }
            // Parse CoachConfig departureDate and schedule
            const departureDateTime = (0, date_fns_1.parse)(`${coachConfig.departureDate} ${coachConfig.schedule}`, 'yyyy-MM-dd hh:mm a', new Date());
            // Calculate the threshold time, 2 hours before departure
            const thresholdTime = (0, date_fns_1.addHours)(departureDateTime, -2);
            // Convert thresholdTime to a string in "hh:mm a" format
            const thresholdTimeString = (0, date_fns_1.format)(thresholdTime, 'hh:mm a');
            // Delete CounterBookedSeat records within 2 hours of CoachConfig departure
            const deletedSeats = yield prisma_1.default.counterBookedSeat.deleteMany({
                where: {
                    coachConfigId,
                    AND: [
                        {
                            date: coachConfig.departureDate,
                        },
                        {
                            schedule: {
                                lte: coachConfig.schedule,
                            },
                        },
                        {
                            schedule: {
                                gte: thresholdTimeString,
                            },
                        },
                    ],
                },
            });
            console.log(`Deleted ${deletedSeats.count} CounterBookedSeat records`);
        }
        catch (error) {
            console.error("Error deleting CounterBookedSeats:", error);
        }
        finally {
            yield prisma_1.default.$disconnect();
        }
    });
}
// deleteCounterBookedSeatsLessThan2Hours(1);
const createCoachConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { departureDates } = _a, data = __rest(_a, ["departureDates"]);
        if (data.coachClass === "E_Class") {
            data.seatAvailable = 41;
        }
        else if (data.coachClass === "B_Class") {
            data.seatAvailable = 28;
        }
        else if (data.coachClass === "S_Class") {
            data.seatAvailable = 43;
        }
        else if (data.coachClass === "Sleeper") {
            data.seatAvailable = 30;
        }
        for (const departureDate of departureDates) {
            const newData = Object.assign(Object.assign({}, data), { departureDate });
            const findCoachConfig = yield prisma_1.default.coachConfig.findFirst({
                where: {
                    coachNo: data.coachNo,
                    departureDate,
                }
            });
            if (!findCoachConfig) {
                const result = yield prisma_1.default.coachConfig.create({
                    data: newData,
                });
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Created Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCoachConfig = createCoachConfig;
const getCoachConfigAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { coachNo: { contains: search, } },
                    { registrationNo: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.coachConfig.findMany({
            where: {
                AND: whereCondition,
            },
            include: {
                fromCounter: {
                    select: {
                        address: true,
                        name: true,
                    }
                },
                destinationCounter: {
                    select: {
                        address: true,
                        name: true,
                    }
                },
                fare: {
                    select: {
                        amount: true,
                    }
                },
                route: {
                    select: {
                        routeName: true,
                    }
                }
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.coachConfig.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach Config retrieved Success',
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
exports.getCoachConfigAll = getCoachConfigAll;
const getCoachConfigUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { coachNo: { contains: search, } },
                    { registrationNo: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.coachConfig.findMany({
            where: {
                AND: whereCondition,
                supervisorId: {
                    not: null,
                }
            },
            include: {
                fromCounter: {
                    select: {
                        address: true,
                        name: true,
                    }
                },
                destinationCounter: {
                    select: {
                        address: true,
                        name: true,
                    }
                },
                fare: {
                    select: {
                        amount: true,
                    }
                },
                route: {
                    select: {
                        routeName: true,
                    }
                },
                driver: {
                    select: {
                        name: true,
                        address: true,
                        contactNo: true,
                    },
                },
                helper: {
                    select: {
                        name: true,
                        address: true,
                        contactNo: true,
                    },
                },
                supervisor: {
                    select: {
                        userName: true,
                        address: true,
                        contactNo: true,
                    },
                },
            },
            skip: skip * take,
            take,
            orderBy: {
                updatedAt: sortOrder === 'asc' ? 'asc' : 'desc',
            }
        });
        const total = yield prisma_1.default.coachConfig.count({
            where: {
                AND: whereCondition,
                supervisorId: {
                    not: null,
                }
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach Config Update retrieved Success',
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
exports.getCoachConfigUpdate = getCoachConfigUpdate;
const getCoachList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, order_controller_1.deleteOldBookings)();
        const { orderType, returnDate, fromCounterId, destinationCounterId, schedule, date, coachType } = req.query;
        if (orderType === "Round_Trip" && !returnDate) {
            return res.status(400).send({
                status: false,
                statusCode: 400,
                message: 'Return Date is required for Round Trip Order'
            });
        }
        const search = {
            active: true,
            fromCounterId: Number(fromCounterId),
            destinationCounterId: Number(destinationCounterId),
            departureDate: date,
        };
        const returnSearch = {
            active: true,
            fromCounterId: Number(destinationCounterId),
            destinationCounterId: Number(fromCounterId),
            departureDate: returnDate,
        };
        if (coachType) {
            //@ts-ignore
            returnSearch.coachType = coachType;
        }
        if (schedule) {
            //@ts-ignore
            search.schedule = schedule;
        }
        if (coachType) {
            //@ts-ignore
            search.coachType = coachType;
        }
        let returnData = [];
        const result = yield prisma_1.default.coachConfig.findMany({
            where: search,
            include: {
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
                        emergencyNumber: true,
                    }
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                        emergencyNumber: true,
                    }
                },
                fromCounter: {
                    select: {
                        name: true,
                        address: true,
                        commissionType: true,
                        commission: true,
                        isSmsSend: true,
                        type: true,
                    }
                },
                destinationCounter: {
                    select: {
                        name: true,
                        address: true,
                        commissionType: true,
                        commission: true,
                        isSmsSend: true,
                        type: true,
                    }
                },
                fare: {
                    select: {
                        amount: true,
                    }
                },
                orderSeat: {
                    include: {
                        order: {
                            include: {
                                counter: true,
                                user: true,
                            }
                        }
                    }
                },
                bookingSeat: {
                    select: {
                        seat: true,
                    }
                },
                CounterBookedSeat: {
                    select: {
                        seat: true,
                        counter: true,
                        user: true,
                    }
                },
                route: {
                    include: {
                        viaRoute: {
                            include: {
                                station: {
                                    select: {
                                        name: true,
                                    }
                                },
                            }
                        },
                    }
                }
            },
        });
        if (orderType === "Round_Trip") {
            returnData = yield prisma_1.default.coachConfig.findMany({
                where: returnSearch,
                include: {
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
                            emergencyNumber: true,
                        }
                    },
                    helper: {
                        select: {
                            name: true,
                            contactNo: true,
                            emergencyNumber: true,
                        }
                    },
                    fromCounter: {
                        select: {
                            name: true,
                            address: true,
                            commissionType: true,
                            commission: true,
                            isSmsSend: true,
                            type: true,
                        }
                    },
                    destinationCounter: {
                        select: {
                            name: true,
                            address: true,
                            commissionType: true,
                            commission: true,
                            isSmsSend: true,
                            type: true,
                        }
                    },
                    fare: {
                        select: {
                            amount: true,
                        }
                    },
                    orderSeat: {
                        include: {
                            order: {
                                select: {
                                    gender: true,
                                }
                            }
                        }
                    },
                    bookingSeat: {
                        select: {
                            seat: true,
                        }
                    },
                    CounterBookedSeat: {
                        select: {
                            seat: true,
                            counter: true,
                            user: true,
                        }
                    },
                    route: {
                        include: {
                            viaRoute: {
                                include: {
                                    station: {
                                        select: {
                                            name: true,
                                        }
                                    },
                                }
                            },
                        }
                    }
                },
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach List retrieved Success',
            data: result,
            returnData,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCoachList = getCoachList;
const getTodayCoachList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        let date = req.query.date;
        const supervisor = req.query.supervisor ? true : false;
        if (!date) {
            date = (0, moment_timezone_1.default)().tz('Asia/Dhaka').format('YYYY-MM-DD');
        }
        const search = {
            departureDate: date,
        };
        if (supervisor) {
            //@ts-ignore
            search.supervisorId = id;
        }
        const result = yield prisma_1.default.coachConfig.findMany({
            where: search,
            include: {
                vehicle: {
                    select: {
                        fitnessCertificate: true,
                        registrationFile: true,
                        routePermit: true,
                        taxToken: true,
                        registrationExpiryDate: true,
                        fitnessExpiryDate: true,
                        routePermitExpiryDate: true,
                        taxTokenExpiryDate: true
                    }
                },
                supervisor: {
                    select: {
                        userName: true,
                        contactNo: true,
                    },
                },
                driver: {
                    select: {
                        name: true,
                        contactNo: true,
                    },
                },
                helper: {
                    select: {
                        name: true,
                        contactNo: true,
                    },
                },
                fromCounter: {
                    select: {
                        name: true,
                        address: true,
                    }
                },
                destinationCounter: {
                    select: {
                        name: true,
                        address: true,
                    }
                },
                fare: {
                    select: {
                        amount: true,
                    }
                },
                route: true
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach List retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTodayCoachList = getTodayCoachList;
const getCoachConfigSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.coachConfig.findUnique({
            where: {
                id
            },
            include: {
                CoachConfigSeats: true,
                fromCounter: true,
                destinationCounter: true,
                fare: true,
                driver: {
                    select: {
                        name: true,
                        address: true,
                        contactNo: true,
                    },
                },
                helper: {
                    select: {
                        name: true,
                        address: true,
                        contactNo: true,
                    },
                },
                supervisor: {
                    select: {
                        userName: true,
                        address: true,
                        contactNo: true,
                    },
                },
            }
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Config Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Coach Config retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCoachConfigSingle = getCoachConfigSingle;
const deleteCoachConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCoachConfig = yield prisma_1.default.coachConfig.findUnique({
            where: {
                id
            },
        });
        if (!findCoachConfig) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Config Not Found'
            });
        }
        yield prisma_1.default.coachConfigSeats.deleteMany({
            where: {
                coachConfigId: id
            }
        });
        const result = yield prisma_1.default.coachConfig.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Config Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCoachConfig = deleteCoachConfig;
const updateCoachConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const data = __rest(req.body, []);
            const id = Number(req.params.id);
            const findCoachConfig = yield prisma.coachConfig.findUnique({
                where: {
                    id
                }
            });
            if (!findCoachConfig) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Coach Config Not Found'
                });
            }
            if (data.registrationNo && findCoachConfig.tripNo) {
                if (data.registrationNo !== findCoachConfig.registrationNo) {
                    const findTripNo = yield prisma.trip.findUnique({
                        where: {
                            id: findCoachConfig.tripNo,
                        }
                    });
                    if (findTripNo && findTripNo.coachConfigIdDownWay) {
                        yield prisma.trip.update({
                            where: {
                                id: findTripNo.id
                            },
                            data: {
                                coachConfigIdDownWay: null,
                                downDate: null,
                            }
                        });
                    }
                    else {
                        yield prisma.trip.delete({
                            where: {
                                id: findTripNo === null || findTripNo === void 0 ? void 0 : findTripNo.id
                            }
                        });
                    }
                }
            }
            else if (data.registrationNo && data.registrationNo !== findCoachConfig.registrationNo) {
                const findTrip = yield prisma.trip.findFirst({
                    where: {
                        registrationNo: data.registrationNo
                    },
                    include: {
                        coachConfig: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                if (!findTrip) {
                    const tripNo = yield prisma.trip.create({
                        data: {
                            registrationNo: data.registrationNo,
                            coachConfigIdUpWay: id,
                            upDate: findCoachConfig.departureDate,
                        }
                    });
                    data.tripNo = tripNo.id;
                }
                else {
                    if (!findTrip.coachConfigIdDownWay) {
                        if (findTrip.coachConfig.routeId === findCoachConfig.routeId) {
                            return res.send({
                                success: false,
                                statusCode: 400,
                                message: 'This Vehicle Already Assigned To Another Trip'
                            });
                        }
                        yield prisma.trip.update({
                            where: {
                                id: findTrip.id
                            },
                            data: {
                                coachConfigIdDownWay: id,
                                downDate: findCoachConfig.departureDate,
                            }
                        });
                        data.tripNo = findTrip.id;
                    }
                    else {
                        const tripNo = yield prisma.trip.create({
                            data: {
                                registrationNo: data.registrationNo,
                                coachConfigIdUpWay: id,
                                upDate: findCoachConfig.departureDate,
                            }
                        });
                        data.tripNo = tripNo.id;
                    }
                }
            }
            const result = yield prisma.coachConfig.update({
                where: {
                    id,
                },
                data
            });
            return result;
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Updated Success',
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCoachConfig = updateCoachConfig;
const coachReportSuperVisor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        let date = (0, moment_timezone_1.default)().tz('Asia/Dhaka').format('YYYY-MM-DD');
        console.log(date);
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const findCoachConfig = yield prisma.coachConfig.findUnique({
                where: {
                    id,
                },
                include: {
                    route: true
                }
            });
            const groupedByCounter = yield prisma.order.groupBy({
                by: ['counterId'],
                where: {
                    coachConfigId: id,
                    counterId: { not: null },
                    date: date,
                },
                _sum: {
                    amount: true,
                    noOfSeat: true,
                },
            });
            const counters = yield prisma.counter.findMany({
                where: {
                    //@ts-ignore
                    id: { in: groupedByCounter.map((entry) => entry.counterId) },
                },
            });
            const formattedCounterReport = [];
            for (const entry of groupedByCounter) {
                const counter = counters.find((c) => c.id === entry.counterId);
                let commission = 0;
                let commissionType = "Fixed";
                //@ts-ignore
                if (counter && counter.type === "Commission_Counter") {
                    //@ts-ignore
                    if (counter.commissionType === "Fixed") {
                        //@ts-ignore
                        commission = counter.commission * entry._sum.noOfSeat;
                    }
                    else {
                        //@ts-ignore
                        commission = (entry._sum.amount || 0) * (counter.commission / 100);
                        commissionType = "Percentage";
                    }
                }
                const totalAmountWithoutCommission = commissionType === "Fixed"
                    ? (entry._sum.amount || 0) - commission
                    : (entry._sum.amount || 0) - commission;
                const findSeat = yield prisma.orderSeat.findMany({
                    where: {
                        coachConfigId: id,
                        order: {
                            counterId: entry === null || entry === void 0 ? void 0 : entry.counterId,
                        },
                    },
                    select: {
                        seat: true,
                    }
                });
                const findOrder = yield prisma.order.findMany({
                    where: {
                        coachConfigId: id,
                        counterId: entry === null || entry === void 0 ? void 0 : entry.counterId,
                    },
                    select: {
                        id: true,
                        customerName: true,
                        phone: true,
                        orderSeat: {
                            select: {
                                seat: true,
                            }
                        },
                        user: {
                            select: {
                                userName: true,
                            }
                        }
                    }
                });
                const findReportSubmitCounter = yield prisma.counterReportSubmit.findFirst({
                    where: {
                        counterId: counter === null || counter === void 0 ? void 0 : counter.id,
                        coachConfigId: id,
                    }
                });
                const data = {
                    counterId: counter === null || counter === void 0 ? void 0 : counter.id,
                    counterType: counter === null || counter === void 0 ? void 0 : counter.type,
                    reportSubmitStatus: findReportSubmitCounter ? true : false,
                    totalAmountWithoutCommission,
                    commission: commission,
                    commissionType,
                    //@ts-ignore
                    counterName: counter ? counter.name : 'Unknown',
                    counterAddress: counter ? counter.address : 'Unknown',
                    counterPhone: (counter === null || counter === void 0 ? void 0 : counter.mobile) || 'Unknown',
                    totalAmount: entry._sum.amount || 0,
                    totalSeat: entry._sum.noOfSeat || 0,
                    seatNumbers: findSeat,
                    orderDetails: findOrder,
                };
                formattedCounterReport.push(data);
            }
            const onlineOrdersTotal = yield prisma.order.aggregate({
                _sum: {
                    amount: true,
                    noOfSeat: true,
                },
                where: {
                    // coachConfigId: id,
                    date,
                    counterId: null,
                },
            });
            let soled = 0;
            let available = (findCoachConfig === null || findCoachConfig === void 0 ? void 0 : findCoachConfig.seatAvailable) || 0;
            formattedCounterReport.forEach((item) => {
                //@ts-ignore
                soled += item.totalSeat;
            });
            soled += onlineOrdersTotal._sum.noOfSeat || 0;
            return {
                soled,
                available,
                coachInfo: findCoachConfig,
                counterWiseReport: formattedCounterReport,
                onlineOrders: {
                    totalAmount: onlineOrdersTotal._sum.amount || 0,
                    totalSeat: onlineOrdersTotal._sum.noOfSeat || 0,
                },
            };
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Config Report',
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
});
exports.coachReportSuperVisor = coachReportSuperVisor;
