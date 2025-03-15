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
exports.deleteBalanceTransfer = exports.getBalanceTransferById = exports.getBalanceTransfer = exports.createBalanceTransfer = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createBalanceTransfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const fromAccount = yield prisma.account.findUnique({
                where: { id: req.body.fromAccountId }
            });
            if (!fromAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'From Account Not Found'
                });
            }
            const toAccount = yield prisma.account.findUnique({
                where: { id: req.body.toAccountId }
            });
            if (!toAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'To Account Not Found'
                });
            }
            const result = yield prisma.balanceTransfer.create({
                data: req.body
            });
            yield prisma.account.update({
                where: { id: fromAccount.id },
                data: {
                    currentBalance: fromAccount.currentBalance - req.body.amount
                }
            });
            yield prisma.account.update({
                where: { id: toAccount.id },
                data: {
                    currentBalance: toAccount.currentBalance + req.body.amount
                }
            });
            return result;
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Balance Transfer done',
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createBalanceTransfer = createBalanceTransfer;
const getBalanceTransfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = parseInt(page) - 1 || 0;
        const take = parseInt(size) || 10;
        if (skip < 0) {
            skip = 0;
        }
        const result = yield prisma_1.default.balanceTransfer.findMany({
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.balanceTransfer.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Balance Transfer retrieved Success',
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
exports.getBalanceTransfer = getBalanceTransfer;
const getBalanceTransferById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findBalanceTransfer = yield prisma_1.default.balanceTransfer.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!findBalanceTransfer) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Balance Transfer Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Balance Transfer retrieved Success',
            data: findBalanceTransfer
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getBalanceTransferById = getBalanceTransferById;
const deleteBalanceTransfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const findBalanceTransfer = yield prisma.balanceTransfer.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            if (!findBalanceTransfer) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Balance Transfer Not Found'
                });
            }
            const fromAccount = yield prisma.account.findUnique({
                where: { id: findBalanceTransfer.fromAccountId }
            });
            if (!fromAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'From Account Not Found'
                });
            }
            const toAccount = yield prisma.account.findUnique({
                where: { id: findBalanceTransfer.toAccountId }
            });
            if (!toAccount) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'To Account Not Found'
                });
            }
            yield prisma.account.update({
                where: { id: findBalanceTransfer.fromAccountId },
                data: {
                    currentBalance: fromAccount.currentBalance + findBalanceTransfer.amount
                }
            });
            yield prisma.account.update({
                where: { id: findBalanceTransfer.toAccountId },
                data: {
                    currentBalance: toAccount.currentBalance - findBalanceTransfer.amount
                }
            });
            yield prisma.balanceTransfer.delete({
                where: {
                    id: findBalanceTransfer.id
                }
            });
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Balance Transfer deleted Successfully'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteBalanceTransfer = deleteBalanceTransfer;
