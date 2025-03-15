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
exports.updateSlider = exports.deleteSlider = exports.getSliderSingle = exports.getSliderAll = exports.createSlider = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const count = yield prisma_1.default.slider.count();
        if (count > 4) {
            return res.status(400).send({
                success: false,
                statusCode: 200,
                message: 'Slider  Added Maximum Number Of Five',
            });
        }
        const result = yield prisma_1.default.slider.create({
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Slider Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createSlider = createSlider;
const getSliderAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortSlider, search } = req.query;
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
        const result = yield prisma_1.default.slider.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.slider.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Slider retrieved Success',
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
exports.getSliderAll = getSliderAll;
const getSliderSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.slider.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Slider Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Slider retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getSliderSingle = getSliderSingle;
const deleteSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findSlider = yield prisma_1.default.slider.findUnique({
            where: {
                id
            },
        });
        if (!findSlider) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Slider Not Found'
            });
        }
        const result = yield prisma_1.default.slider.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Slider Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Expense Slider Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteSlider = deleteSlider;
const updateSlider = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const id = Number(req.params.id);
        const findSlider = yield prisma_1.default.slider.findUnique({
            where: {
                id
            }
        });
        if (!findSlider) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Slider Not Found'
            });
        }
        const result = yield prisma_1.default.slider.update({
            where: {
                id,
            },
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Slider Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateSlider = updateSlider;
