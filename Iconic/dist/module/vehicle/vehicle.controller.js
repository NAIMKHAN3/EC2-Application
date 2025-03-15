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
exports.updateVehicle = exports.deleteVehicle = exports.getVehicleSingle = exports.getVehicleAll = exports.createVehicle = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const findReg = yield prisma_1.default.vehicle.findUnique({
            where: {
                registrationNo: data.registrationNo
            }
        });
        if (findReg) {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                message: 'Vehicle with same registration number already exists'
            });
        }
        const result = yield prisma_1.default.vehicle.create({
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createVehicle = createVehicle;
const getVehicleAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { registrationNo: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.vehicle.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.vehicle.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Category retrieved Success',
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
exports.getVehicleAll = getVehicleAll;
const getVehicleSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.vehicle.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Vehicle Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Vehicle retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getVehicleSingle = getVehicleSingle;
const deleteVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findVehicle = yield prisma_1.default.vehicle.findUnique({
            where: {
                id
            },
        });
        if (!findVehicle) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Vehicle Not Found'
            });
        }
        const result = yield prisma_1.default.vehicle.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Vehicle Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteVehicle = deleteVehicle;
const updateVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = __rest(req.body, []);
        const id = Number(req.params.id);
        const findVehicle = yield prisma_1.default.vehicle.findUnique({
            where: {
                id
            }
        });
        if (!findVehicle) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Vehicle Not Found'
            });
        }
        const result = yield prisma_1.default.vehicle.update({
            where: {
                id,
            },
            data
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Vehicle Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateVehicle = updateVehicle;
