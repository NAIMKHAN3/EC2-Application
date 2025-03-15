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
exports.updateFare = exports.deleteFare = exports.getFareSingle = exports.getFareAll = exports.createFare = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createFare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.fare.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Fare Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createFare = createFare;
const getFareAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { route: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.fare.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.fare.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Fare retrieved Success',
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
exports.getFareAll = getFareAll;
const getFareSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.fare.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Fare Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Fare retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getFareSingle = getFareSingle;
const deleteFare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findFare = yield prisma_1.default.fare.findUnique({
            where: {
                id
            },
        });
        if (!findFare) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Fare Not Found'
            });
        }
        const result = yield prisma_1.default.fare.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Fare Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Fare Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteFare = deleteFare;
const updateFare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findFare = yield prisma_1.default.fare.findUnique({
            where: {
                id
            }
        });
        if (!findFare) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Fare Not Found'
            });
        }
        const result = yield prisma_1.default.fare.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Fare Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateFare = updateFare;
