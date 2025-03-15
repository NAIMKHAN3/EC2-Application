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
exports.updateCoach = exports.deleteCoach = exports.getCoachSingle = exports.getCoachAll = exports.createCoach = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCoach = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findCoachNo = yield prisma_1.default.coach.findUnique({
            where: {
                coachNo: req.body.coachNo
            }
        });
        if (findCoachNo) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Already Exists'
            });
        }
        const result = yield prisma_1.default.coach.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCoach = createCoach;
const getCoachAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                ],
            });
        }
        const result = yield prisma_1.default.coach.findMany({
            where: {
                AND: whereCondition,
            },
            include: {
                fare: {
                    select: {
                        amount: true,
                    }
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
                route: {
                    select: {
                        routeName: true,
                    }
                },
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.coach.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Coach retrieved Success',
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
exports.getCoachAll = getCoachAll;
const getCoachSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.coach.findUnique({
            where: {
                id
            },
            include: {
                fare: {
                    select: {
                        amount: true,
                    }
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
                route: {
                    select: {
                        routeName: true,
                    }
                },
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Coach retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCoachSingle = getCoachSingle;
const deleteCoach = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCoach = yield prisma_1.default.coach.findUnique({
            where: {
                id
            },
        });
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            });
        }
        const result = yield prisma_1.default.coach.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Coach Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCoach = deleteCoach;
const updateCoach = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCoach = yield prisma_1.default.coach.findUnique({
            where: {
                id
            }
        });
        if (!findCoach) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Coach Not Found'
            });
        }
        if (req.body.coachNo) {
            const findCoachReg = yield prisma_1.default.coach.findUnique({
                where: {
                    coachNo: req.body.coachNo
                }
            });
            if (findCoachReg && findCoach.id !== findCoachReg.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Coach Number Already Exists'
                });
            }
        }
        const result = yield prisma_1.default.coach.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Coach Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCoach = updateCoach;
