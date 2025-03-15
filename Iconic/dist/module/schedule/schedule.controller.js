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
exports.updateSchedule = exports.deleteSchedule = exports.getScheduleSingle = exports.getScheduleAll = exports.createSchedule = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findStation = yield prisma_1.default.schedule.findFirst({
            where: {
                time: req.body.time
            }
        });
        if (findStation) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Schedule Already Exists'
            });
        }
        const result = yield prisma_1.default.schedule.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Schedule Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createSchedule = createSchedule;
const getScheduleAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { time: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.schedule.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.schedule.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Schedule retrieved Success',
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
exports.getScheduleAll = getScheduleAll;
const getScheduleSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.schedule.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Schedule Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Schedule retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getScheduleSingle = getScheduleSingle;
const deleteSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findSchedule = yield prisma_1.default.schedule.findUnique({
            where: {
                id
            },
        });
        if (!findSchedule) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Schedule Not Found'
            });
        }
        const result = yield prisma_1.default.schedule.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Schedule Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Schedule Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteSchedule = deleteSchedule;
const updateSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findSchedule = yield prisma_1.default.schedule.findUnique({
            where: {
                id
            }
        });
        if (!findSchedule) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Schedule Not Found'
            });
        }
        if (req.body.time) {
            const findTime = yield prisma_1.default.schedule.findFirst({
                where: {
                    time: req.body.time
                }
            });
            if (findTime && findSchedule.id !== findTime.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Time Already Exists'
                });
            }
        }
        const result = yield prisma_1.default.schedule.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Schedule Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateSchedule = updateSchedule;
