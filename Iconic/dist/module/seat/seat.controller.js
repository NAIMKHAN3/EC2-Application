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
exports.updateSeat = exports.deleteSeat = exports.getSeatSingle = exports.getSeatAll = exports.createSeat = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createSeat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findSeat = yield prisma_1.default.seat.findUnique({
            where: {
                name: req.body.name
            }
        });
        if (findSeat) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Already Exists'
            });
        }
        const result = yield prisma_1.default.seat.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createSeat = createSeat;
const getSeatAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield prisma_1.default.seat.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.seat.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Seat retrieved Success',
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
exports.getSeatAll = getSeatAll;
const getSeatSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.seat.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Seat retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getSeatSingle = getSeatSingle;
const deleteSeat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findSeat = yield prisma_1.default.seat.findUnique({
            where: {
                id
            },
        });
        if (!findSeat) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Seat Not Found'
            });
        }
        const result = yield prisma_1.default.seat.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Seat Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteSeat = deleteSeat;
const updateSeat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findSeat = yield prisma_1.default.seat.findUnique({
            where: {
                id
            }
        });
        if (!findSeat) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'seat Not Found'
            });
        }
        if (req.body.name) {
            const findName = yield prisma_1.default.seat.findFirst({
                where: {
                    name: req.body.name
                }
            });
            if (findName && findSeat.id !== findName.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Name Already Exists'
                });
            }
        }
        const result = yield prisma_1.default.seat.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seat Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateSeat = updateSeat;
