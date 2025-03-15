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
exports.updateFuelCompany = exports.deleteFuelCompany = exports.getFuelCompanySingle = exports.getFuelCompanyAll = exports.createFuelCompany = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createFuelCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone = "null", } = req.body;
        const isExistingPhone = yield prisma_1.default.fuelCompany.findFirst({ where: { phone } });
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Fuel Company Phone Already Exist"
            });
        }
        const result = yield prisma_1.default.fuelCompany.create({
            data: req.body,
        });
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Fuel Company Created Successfully',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createFuelCompany = createFuelCompany;
const getFuelCompanyAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortOrder, search } = req.query;
        let skip = (parseInt(page) - 1) || 0;
        const take = (parseInt(size)) || 10;
        const order = (sortOrder === null || sortOrder === void 0 ? void 0 : sortOrder.toLowerCase()) === 'desc' ? 'desc' : 'asc';
        const whereCondition = [];
        if (skip < 0) {
            skip = 0;
        }
        if (search) {
            whereCondition.push({
                OR: [
                    { name: { contains: search, } },
                    { email: { contains: search, } },
                    { phone: { contains: search, } },
                    { address: { contains: search, } },
                ],
            });
        }
        [];
        let result = yield prisma_1.default.fuelCompany.findMany({
            where: {
                AND: whereCondition,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                address: true,
            },
            skip: skip * take,
            take,
        });
        let total = yield prisma_1.default.fuelCompany.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get FuelCompany All Successfully',
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
exports.getFuelCompanyAll = getFuelCompanyAll;
const getFuelCompanySingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.fuelCompany.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                website: true,
            }
        });
        res.status(200).send({
            success: true,
            message: "Get FuelCompany Success",
            statusCode: 200,
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getFuelCompanySingle = getFuelCompanySingle;
const deleteFuelCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.fuelCompany.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).send({
            success: true,
            message: "Fuel Company Delete Success",
            statusCode: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteFuelCompany = deleteFuelCompany;
const updateFuelCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.fuelCompany.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Fuel Company Updated Success",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateFuelCompany = updateFuelCompany;
