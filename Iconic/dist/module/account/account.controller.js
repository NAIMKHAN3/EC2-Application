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
exports.cashFlow = exports.deleteAccount = exports.getAccountSingle = exports.getAccountsAll = exports.updateAccount = exports.createAccount = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.currentBalance = req.body.openingBalance;
        const result = yield prisma_1.default.account.create({ data: req.body });
        res.status(201).send({
            success: true,
            message: 'Account Created Done',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createAccount = createAccount;
const updateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.account.update({
            where: {
                id
            },
            data: req.body
        });
        res.status(201).send({
            success: true,
            message: 'Account Update Done',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateAccount = updateAccount;
const getAccountsAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.query.type || "";
        let result;
        if (type === 'All') {
            result = yield prisma_1.default.account.findMany();
        }
        else {
            result = yield prisma_1.default.account.findMany({
                where: {
                    accountType: type
                }
            });
        }
        res.status(201).send({
            success: true,
            message: 'Account get Done',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAccountsAll = getAccountsAll;
const getAccountSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.account.findUnique({ where: { id } });
        res.status(201).send({
            success: true,
            message: 'Account get Done',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAccountSingle = getAccountSingle;
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.account.delete({ where: { id } });
        res.status(201).send({
            success: true,
            message: 'Account delete Done',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteAccount = deleteAccount;
const cashFlow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let totalAmount = 0;
        let result = yield prisma_1.default.account.findMany({
            select: {
                accountName: true,
                accountNumber: true,
                accountType: true,
                bankName: true,
                currentBalance: true,
            }
        });
        for (let account of result) {
            totalAmount += account.currentBalance;
        }
        res.status(201).send({
            success: true,
            message: 'Cash Flow Data Done',
            data: {
                totalAmount: totalAmount.toFixed(2),
                accounts: result,
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.cashFlow = cashFlow;
