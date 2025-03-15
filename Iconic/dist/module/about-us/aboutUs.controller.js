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
exports.updateAboutUs = exports.deleteAboutUs = exports.getAboutUsSingle = exports.getAboutUsAll = exports.createAboutUs = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createAboutUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const result = yield prisma_1.default.aboutUs.create({
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'About Us Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createAboutUs = createAboutUs;
const getAboutUsAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortAboutUs, search } = req.query;
        let skip = parseInt(page) - 1 || 0;
        const take = parseInt(size) || 10;
        const whereCondition = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { image: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.aboutUs.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.aboutUs.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'About Us retrieved Success',
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
exports.getAboutUsAll = getAboutUsAll;
const getAboutUsSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.aboutUs.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'AboutUs Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single AboutUs retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAboutUsSingle = getAboutUsSingle;
const deleteAboutUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findAboutUs = yield prisma_1.default.aboutUs.findUnique({
            where: {
                id
            },
        });
        if (!findAboutUs) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'AboutUs Not Found'
            });
        }
        const result = yield prisma_1.default.aboutUs.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'AboutUs Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense AboutUs Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteAboutUs = deleteAboutUs;
const updateAboutUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const id = Number(req.params.id);
        const findAboutUs = yield prisma_1.default.aboutUs.findUnique({
            where: {
                id
            }
        });
        if (!findAboutUs) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'About Us Not Found'
            });
        }
        const result = yield prisma_1.default.aboutUs.update({
            where: {
                id,
            },
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'About Us Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateAboutUs = updateAboutUs;
