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
exports.updateCMS = exports.deleteCMS = exports.getCMS = exports.createCMS = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCMS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const findCms = yield prisma_1.default.cMS.findFirst();
        if (findCms) {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                message: 'CMS already exists'
            });
        }
        const result = yield prisma_1.default.cMS.create({
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCMS = createCMS;
const getCMS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.cMS.findFirst();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCMS = getCMS;
const deleteCMS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCms = yield prisma_1.default.cMS.findUnique({
            where: {
                id
            },
        });
        if (!findCms) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'CMS Not Found'
            });
        }
        const result = yield prisma_1.default.cMS.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'CMS Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCMS = deleteCMS;
const updateCMS = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const id = Number(req.params.id);
        const findCms = yield prisma_1.default.cMS.findUnique({
            where: {
                id
            }
        });
        if (!findCms) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'CMS Not Found'
            });
        }
        const result = yield prisma_1.default.cMS.update({
            where: {
                id,
            },
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'CMS Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCMS = updateCMS;
