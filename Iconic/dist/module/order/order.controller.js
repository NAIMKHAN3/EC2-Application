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
exports.findCustomer = exports.cancelBooking = exports.getTodayOrderCancelRequest = exports.getTodaySalesCounter = exports.duePayment = exports.cancelRequest = exports.updateOrder = exports.deleteOrder = exports.cancelTicket = exports.findTicket = exports.getOrderSingle = exports.getOrderAll = exports.unBookingSeat = exports.bookingSeat = exports.checkSeatAvailability = exports.createOrder = exports.deleteOldBookings = exports.generateTicketNo = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const generateTicketNo = () => __awaiter(void 0, void 0, void 0, function* () {
    const findOrder = yield prisma_1.default.order.findFirst({
        orderBy: {
            createdAt: 'desc'
        }
    });
    let findId;
    if (findOrder) {
        findId = (findOrder === null || findOrder === void 0 ? void 0 : findOrder.ticketNo.toString()) || '00000';
    }
    else {
        findId = '00000';
    }
    const nextId = parseInt(findId) + 1;
    const newId = nextId.toString().padStart(5, '0');
    return newId;
});
exports.generateTicketNo = generateTicketNo;
const deleteOldBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    try {
        const result = yield prisma_1.default.bookingSeat.deleteMany({
            where: {
                createdAt: {
                    lte: fiveMinutesAgo,
                },
            },
        });
    }
    catch (error) {
        console.error('Error deleting old bookings:', error);
    }
});
exports.deleteOldBookings = deleteOldBookings;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { seats } = _a, data = __rest(_a, ["seats"]);
        if (data.bookingType == "SeatBooking" && !data.counterId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'CounterId Is required for booking type SeatBooking'
            });
        }
        if (data.bookingType === "SeatBooking") {
            for (const seat of seats) {
                const findUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: data.counterId,
                    }
                });
                if (findUser) {
                    yield prisma_1.default.counterBookedSeat.create({
                        data: {
                            counterId: findUser.counterId,
                            userId: findUser.id,
                            seat: seat.seat,
                            coachConfigId: seat.coachConfigId,
                            schedule: seat.schedule,
                            date: seat.date
                        }
                    });
                }
            }
            res.status(200).send({
                success: true,
                statusCode: 200,
                message: 'Order Booked Success',
            });
        }
        else {
            if (data.counterId) {
                const findUser = yield prisma_1.default.user.findUnique({
                    where: {
                        id: data.counterId,
                    }
                });
                if (findUser) {
                    data.counterId = findUser.counterId,
                        data.userId = findUser.id;
                }
                data.status = "Success";
                data.paymentMethod = "Cash";
                data.online = false;
            }
            if (data.counterId && data.paymentType == "FULL") {
                data.payment = true;
            }
            if (!data.counterId && data.paymentType == "PARTIAL" && !data.paymentAmount) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Payment Amount is required for PARTIAL payment'
                });
            }
            if (data.counterId && data.paymentType == "FULL") {
                data.paymentAmount = data.amount;
                data.dueAmount = 0;
            }
            else if (data.counterId && data.paymentType == "PARTIAL") {
                data.dueAmount = data.amount - data.paymentAmount;
                data.partialPaymentAmount = data.paymentAmount;
                data.partial = true;
            }
            else if (!data.counterId && data.paymentType == "FULL") {
                data.dueAmount = data.amount;
                data.paymentAmount = data.amount;
            }
            else if (!data.counterId && data.paymentType == "PARTIAL") {
                data.dueAmount = data.amount;
            }
            data.ticketNo = yield (0, exports.generateTicketNo)();
            if (data.orderType === "Round_Trip") {
                if (!(data === null || data === void 0 ? void 0 : data.returnBoardingPoint) || !(data === null || data === void 0 ? void 0 : data.returnDroppingPoint)) {
                    data.returnBoardingPoint = data.droppingPoint;
                    data.returnDroppingPoint = data.boardingPoint;
                }
            }
            data.coachConfigId = seats[0].coachConfigId;
            const result = yield prisma_1.default.order.create({
                data
            });
            if (result) {
                for (const seat of seats) {
                    const findCoachConfig = yield prisma_1.default.coachConfig.findUnique({
                        where: {
                            id: seat.coachConfigId
                        }
                    });
                    if (result.counterId) {
                        yield prisma_1.default.counterBookedSeat.deleteMany({
                            where: {
                                counterId: result.counterId,
                                seat: seat.seat,
                                coachConfigId: seat.coachConfigId,
                                schedule: seat.schedule,
                                date: seat.date
                            }
                        });
                    }
                    if (findCoachConfig && findCoachConfig.seatAvailable >= seats.length) {
                        yield prisma_1.default.coachConfig.update({
                            where: {
                                id: seat.coachConfigId
                            },
                            data: {
                                seatAvailable: {
                                    decrement: 1
                                }
                            }
                        });
                    }
                    yield prisma_1.default.orderSeat.create({
                        data: {
                            coachConfigId: seat.coachConfigId,
                            date: seat.date,
                            schedule: seat.schedule,
                            seat: seat.seat,
                            orderId: result.id,
                            status: result.counterId ? "Success" : "Pending",
                            unitPrice: result.amount / seats.length,
                            paymentMethod: result.counterId ? "Cash" : result.paymentMethod,
                            online: result.counterId ? false : true,
                        }
                    });
                    yield prisma_1.default.bookingSeat.deleteMany({
                        where: {
                            coachConfigId: seat.coachConfigId,
                            date: seat.date,
                            schedule: seat.schedule,
                            seat: seat.seat,
                        }
                    });
                }
            }
            const findOrder = yield prisma_1.default.order.findUnique({
                where: {
                    id: result.id,
                },
                include: {
                    orderSeat: {
                        include: {
                            coachConfig: true,
                        }
                    }
                }
            });
            res.status(200).send({
                success: true,
                statusCode: 200,
                message: 'Order Created Success',
                data: findOrder
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.createOrder = createOrder;
const checkSeatAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { seats, date, schedule, coachConfigId, } = req.body;
        let available = true;
        let seatNo = null;
        for (const seat of seats) {
            const findSeat = yield prisma_1.default.orderSeat.findFirst({
                where: {
                    coachConfigId,
                    date,
                    schedule,
                    seat
                }
            });
            if (findSeat) {
                available = false;
                seatNo = findSeat.seat;
                break;
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: available ? 'Seats Available' : `${seatNo} Seats Not Available`,
            data: { available }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.checkSeatAvailability = checkSeatAvailability;
const bookingSeat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.deleteOldBookings)();
        const { seat, date, schedule, coachConfigId, } = req.body;
        let available = true;
        let seatNo = null;
        const findSeat = yield prisma_1.default.bookingSeat.findFirst({
            where: {
                coachConfigId,
                date,
                schedule,
                seat
            }
        });
        if (findSeat) {
            res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Already Booked'
            });
        }
        else {
            const findOrderSeat = yield prisma_1.default.orderSeat.findFirst({
                where: {
                    coachConfigId,
                    date,
                    schedule,
                    seat
                }
            });
            if (findOrderSeat) {
                res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Seat Already Booked'
                });
            }
            else {
                const createBooking = yield prisma_1.default.bookingSeat.create({
                    data: {
                        coachConfigId,
                        date,
                        schedule,
                        seat
                    }
                });
                res.status(200).send({
                    success: true,
                    statusCode: 200,
                    message: available ? 'Seats Available' : `${seatNo} Seats Not Available`,
                    data: { available }
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.bookingSeat = bookingSeat;
const unBookingSeat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.deleteOldBookings)();
        const { seat, date, schedule, coachConfigId, } = req.body;
        const findSeat = yield prisma_1.default.bookingSeat.findFirst({
            where: {
                coachConfigId,
                date,
                schedule,
                seat
            }
        });
        if (findSeat) {
            yield prisma_1.default.bookingSeat.delete({
                where: {
                    id: findSeat.id
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Unbooked Done",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.unBookingSeat = unBookingSeat;
const getOrderAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { date: { contains: search, } },
                    { customerName: { contains: search, } },
                    { phone: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.order.findMany({
            where: {
                AND: whereCondition
            },
            include: {
                counter: {
                    select: {
                        address: true
                    }
                },
                orderSeat: {
                    select: {
                        seat: true
                    }
                }
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.order.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order retrieved Success',
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
exports.getOrderAll = getOrderAll;
const getOrderSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.order.findUnique({
            where: {
                id
            },
            include: {
                counter: {
                    select: {
                        address: true
                    }
                },
                orderSeat: {
                    select: {
                        seat: true
                    }
                }
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Order retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getOrderSingle = getOrderSingle;
const findTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticketNo = req.params.id;
        let result;
        result = yield prisma_1.default.order.findUnique({
            where: {
                ticketNo
            },
            include: {
                counter: {
                    select: {
                        address: true
                    }
                },
                orderSeat: {
                    include: {
                        coachConfig: true,
                    }
                }
            },
        });
        if (!result) {
            result = yield prisma_1.default.order.findFirst({
                where: {
                    phone: ticketNo
                },
                include: {
                    counter: {
                        select: {
                            address: true
                        }
                    },
                    orderSeat: {
                        include: {
                            coachConfig: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Ticket Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Ticket retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.findTicket = findTicket;
const cancelTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticketNo = req.params.id;
        const { cancelNote, refundPercentage, refundType } = req.body;
        const { id } = req.user;
        const result = yield prisma_1.default.order.findUnique({
            where: {
                ticketNo
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Ticket Not Found'
            });
        }
        yield prisma_1.default.order.update({
            where: {
                ticketNo
            },
            data: {
                cancelBy: id,
                cancelNote,
                refundPercentage,
                refundType,
                status: "Cancelled",
                cancelRequest: false,
            }
        });
        let orderSeat = yield prisma_1.default.orderSeat.findMany({
            where: {
                id: result.id
            },
        });
        for (const seat of orderSeat) {
            yield prisma_1.default.cancelOrderSeat.create({
                data: {
                    orderId: result.id,
                    seat: seat.seat,
                    coachConfigId: seat.coachConfigId,
                    date: seat.date,
                    schedule: seat.schedule
                }
            });
            yield prisma_1.default.orderSeat.delete({
                where: {
                    id: seat.id
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Ticket Cancel Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.cancelTicket = cancelTicket;
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findOrder = yield prisma_1.default.order.findUnique({
            where: {
                id
            },
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            });
        }
        yield prisma_1.default.orderSeat.deleteMany({
            where: {
                orderId: id
            }
        });
        const result = yield prisma_1.default.order.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Order Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteOrder = deleteOrder;
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const id = Number(req.params.id);
        const findOrder = yield prisma_1.default.order.findUnique({
            where: {
                id
            }
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            });
        }
        const result = yield prisma_1.default.order.update({
            where: {
                id,
            },
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateOrder = updateOrder;
const cancelRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findOrder = yield prisma_1.default.order.findUnique({
            where: {
                id
            }
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            });
        }
        const result = yield prisma_1.default.order.update({
            where: {
                id,
            },
            data: {
                cancelRequest: true
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.cancelRequest = cancelRequest;
const duePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findOrder = yield prisma_1.default.order.findUnique({
            where: {
                id
            }
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order Not Found'
            });
        }
        const result = yield prisma_1.default.order.update({
            where: {
                id,
            },
            data: {
                dueAmount: {
                    decrement: findOrder.dueAmount,
                },
                paymentAmount: {
                    increment: findOrder.dueAmount
                },
                payment: true,
                status: "Success"
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Order Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.duePayment = duePayment;
const getTodaySalesCounter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        console.log({ startDate, endDate });
        const { id, counterId } = req.user;
        const sales = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
                order: {
                    counterId: counterId
                },
            },
            include: {
                coachConfig: {
                    include: {
                        route: true
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
                    { createdAt: { lte: endDate } },
                ],
                order: {
                    counterId: counterId
                },
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
                order: {
                    counterId: counterId
                },
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
                order: {
                    counterId: counterId
                },
                status: "Success",
                online: true,
            },
            include: {
                coachConfig: {
                    include: {
                        route: true
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
                order: {
                    counterId: counterId
                },
                status: "Failed",
                online: true,
            },
            include: {
                coachConfig: {
                    include: {
                        route: true
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
        const todaySalesHistory = yield prisma_1.default.order.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                counterId: counterId,
                online: false,
                cancelRequest: false,
            },
            include: {
                orderSeat: {
                    select: {
                        seat: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const todaySalesCount = yield prisma_1.default.orderSeat.count({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                order: {
                    counterId: counterId
                },
                online: false,
            },
        });
        const cancelHistory = yield prisma_1.default.orderSeat.findMany({
            where: {
                AND: [
                    { createdAt: { gte: startDate } },
                    { createdAt: { lte: endDate } }
                ],
                order: {
                    counterId: counterId
                },
                status: "Failed",
            },
            include: {
                coachConfig: {
                    include: {
                        route: true
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
        let offlineTicketCount = todaySalesCount;
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
exports.getTodaySalesCounter = getTodaySalesCounter;
const getTodayOrderCancelRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fromDate = req.query.fromDate || new Date();
        const toDate = req.query.toDate || new Date();
        const startDate = new Date(fromDate.toString());
        const endDate = new Date(toDate.toString());
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const { id } = req.user;
        const cancelRequest = yield prisma_1.default.order.findMany({
            where: {
                AND: [{ createdAt: { gte: startDate } }, { createdAt: { lte: endDate } }],
                cancelRequest: true,
            },
            include: {
                orderSeat: {
                    include: {
                        coachConfig: {
                            include: {
                                route: true
                            }
                        },
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
            message: "Get Today Sales Successfully",
            data: cancelRequest,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getTodayOrderCancelRequest = getTodayOrderCancelRequest;
const cancelBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, counterId } = req.user;
        const { seats } = req.body;
        for (const seat of seats) {
            yield prisma_1.default.counterBookedSeat.deleteMany({
                where: {
                    counterId: counterId,
                    userId: id,
                    seat: seat.seat,
                    coachConfigId: seat.coachConfigId,
                    schedule: seat.schedule,
                    date: seat.date
                }
            });
            yield prisma_1.default.bookingSeat.deleteMany({
                where: {
                    seat: seat.seat,
                    coachConfigId: seat.coachConfigId,
                    schedule: seat.schedule,
                    date: seat.date
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Booking Cancelled Successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.cancelBooking = cancelBooking;
const findCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phoneNumber = req.query.phoneNumber;
        const findOrder = yield prisma_1.default.order.findFirst({
            where: {
                phone: phoneNumber
            }
        });
        let customer = null;
        if (findOrder) {
            customer = {
                name: findOrder.customerName,
                phone: findOrder.phone,
                gender: findOrder.gender,
                boardingPoint: findOrder.boardingPoint,
                droppingPoint: findOrder.droppingPoint,
                address: findOrder.address,
                email: findOrder.email,
                nid: findOrder.nid,
                nationality: findOrder.nationality,
            };
        }
        res.status(200).send({
            status: true,
            statusCode: 200,
            message: "Customer Found Successfully",
            data: customer,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.findCustomer = findCustomer;
