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
exports.updateDiscount = exports.deleteDiscount = exports.checkDiscountValidity = exports.getDiscountSingle = exports.getDiscountAll = exports.createDiscount = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createDiscount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.discount.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createDiscount = createDiscount;
const getDiscountAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                // { startDate: { contains: search as string, } },
                ],
            });
        }
        const result = yield prisma_1.default.discount.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.discount.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Discount retrieved Success',
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
exports.getDiscountAll = getDiscountAll;
const getDiscountSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.discount.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Discount retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getDiscountSingle = getDiscountSingle;
const checkDiscountValidity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = req.query.title;
        const currentDate = new Date();
        const result = yield prisma_1.default.discount.findFirst({
            where: {
                title: title,
                startDate: {
                    lte: currentDate,
                },
                endDate: {
                    gte: currentDate,
                },
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found or Not Valid',
                data: false
            });
        }
        // If the discount is valid
        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount is valid',
            data: true
        });
    }
    catch (err) {
        next(err);
    }
});
exports.checkDiscountValidity = checkDiscountValidity;
const deleteDiscount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findDiscount = yield prisma_1.default.discount.findUnique({
            where: {
                id
            },
        });
        if (!findDiscount) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found'
            });
        }
        const result = yield prisma_1.default.discount.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Discount Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteDiscount = deleteDiscount;
const updateDiscount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findDiscount = yield prisma_1.default.discount.findUnique({
            where: {
                id
            }
        });
        if (!findDiscount) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Discount Not Found'
            });
        }
        const result = yield prisma_1.default.discount.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Discount Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateDiscount = updateDiscount;
