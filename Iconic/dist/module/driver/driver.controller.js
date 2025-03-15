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
exports.updateDriver = exports.deleteDriver = exports.getDriverSingle = exports.getDriverAll = exports.createDriver = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contactNo = "null", } = req.body;
        const isExistingPhone = yield prisma_1.default.driver.findUnique({ where: { contactNo } });
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Driver Phone Already Exist"
            });
        }
        const result = yield prisma_1.default.driver.create({
            data: req.body,
        });
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Driver Created Successfully',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createDriver = createDriver;
const getDriverAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { contactNo: { contains: search, } },
                    { address: { contains: search, } },
                ],
            });
        }
        [];
        let result = yield prisma_1.default.driver.findMany({
            where: {
                AND: whereCondition,
            },
            select: {
                id: true,
                name: true,
                contactNo: true,
                address: true,
                active: true,
                avatar: true,
                licensePhoto: true,
                referenceBy: true,
            },
            skip: skip * take,
            take,
        });
        let total = yield prisma_1.default.driver.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Driver All Successfully',
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
exports.getDriverAll = getDriverAll;
const getDriverSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.driver.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                email: true,
                contactNo: true,
                address: true,
                active: true,
                avatar: true,
                dateOfBirth: true,
                maritalStatus: true,
                gender: true,
                bloodGroup: true,
                emergencyNumber: true,
                licenseExpDate: true,
                licenseIssueDate: true,
                licenseNumber: true,
                referenceBy: true,
                licensePhoto: true,
            }
        });
        res.status(200).send({
            success: true,
            message: "Get Driver Success",
            statusCode: 200,
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getDriverSingle = getDriverSingle;
const deleteDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.driver.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).send({
            success: true,
            message: "Driver Delete Success",
            statusCode: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteDriver = deleteDriver;
const updateDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.driver.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Driver Updated Success",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateDriver = updateDriver;
