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
exports.updateCounter = exports.deleteCounter = exports.getCounterSingle = exports.getCounterAll = exports.createCounter = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCounter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobile, type, commissionType, commission } = req.body;
        const findCounterMobile = yield prisma_1.default.counter.findUnique({
            where: {
                mobile: mobile,
            }
        });
        if (findCounterMobile) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Mobile Number Already Exists'
            });
        }
        if (type === "Commission_Counter") {
            if (!commissionType || !commission) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Commission Type and commission field required because counter type Commission_Counter'
                });
            }
        }
        if (type === "Own_Counter" || type === "Head_Office") {
            req.body.commissionType = "Fixed";
            req.body.commission = 0;
        }
        const result = yield prisma_1.default.counter.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCounter = createCounter;
const getCounterAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { primaryContactPersonName: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.counter.findMany({
            where: {
                AND: whereCondition,
            },
            skip: skip * take,
            take,
            select: {
                id: true,
                mobile: true,
                name: true,
                station: true,
                status: true,
                address: true,
                type: true,
                primaryContactPersonName: true
            },
        });
        const total = yield prisma_1.default.counter.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Counter retrieved Success',
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
exports.getCounterAll = getCounterAll;
const getCounterSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.counter.findUnique({
            where: {
                id
            },
            include: {
                station: true
            }
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Counter Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Counter retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCounterSingle = getCounterSingle;
const deleteCounter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCounter = yield prisma_1.default.counter.findUnique({
            where: {
                id
            },
        });
        if (!findCounter) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Counter Not Found'
            });
        }
        const result = yield prisma_1.default.counter.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Counter Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCounter = deleteCounter;
const updateCounter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCounter = yield prisma_1.default.counter.findUnique({
            where: {
                id
            }
        });
        if (!findCounter) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Counter Not Found'
            });
        }
        if (req.body.mobile) {
            const findCounterMobile = yield prisma_1.default.counter.findUnique({
                where: {
                    mobile: req.body.mobile
                }
            });
            if (findCounterMobile && findCounter.id !== findCounterMobile.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Mobile Number Already Exists'
                });
            }
        }
        if (req.body.type === "Commission_Counter") {
            if (!req.body.commissionType || !req.body.commission) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Commission Type and commission field required because counter type Commission_Counter'
                });
            }
        }
        if (req.body.type === "Own_Counter" || req.body.type === "Head_Office") {
            req.body.commissionType = "Fixed";
            req.body.commission = 0;
        }
        const result = yield prisma_1.default.counter.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Counter Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCounter = updateCounter;
