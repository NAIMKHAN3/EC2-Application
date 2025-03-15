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
exports.updateCustomer = exports.deleteCustomer = exports.getCustomerSingle = exports.getCustomerAll = exports.createCustomer = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, } = req.body;
        const isExistingPhone = yield prisma_1.default.customer.findUnique({ where: { phone } });
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Customer Phone Already Exist"
            });
        }
        const result = yield prisma_1.default.customer.create({
            data: req.body,
        });
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Customer Created Successfully',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCustomer = createCustomer;
const getCustomerAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { phone: { contains: search, } },
                    { address: { contains: search, } },
                ],
            });
        }
        [];
        let result = yield prisma_1.default.customer.findMany({
            where: {
                AND: whereCondition
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
        let total = yield prisma_1.default.customer.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Get Customer All Successfully',
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
exports.getCustomerAll = getCustomerAll;
const getCustomerSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.customer.findUnique({
            where: {
                id: Number(id)
            },
        });
        res.status(200).send({
            success: true,
            message: "Get Customer Success",
            statusCode: 200,
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCustomerSingle = getCustomerSingle;
const deleteCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield prisma_1.default.customer.delete({
            where: {
                id: Number(id)
            }
        });
        res.status(200).send({
            success: true,
            message: "Customer Delete Success",
            statusCode: 200,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCustomer = deleteCustomer;
const updateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const findCustomer = yield prisma_1.default.customer.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!findCustomer) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Customer Not Found'
            });
        }
        if (req.body.phone) {
            const findCustomerPhone = yield prisma_1.default.customer.findUnique({
                where: {
                    phone: req.body.phone
                }
            });
            if (findCustomerPhone && findCustomer.id !== findCustomerPhone.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Phone Number Already Exists'
                });
            }
        }
        const result = yield prisma_1.default.customer.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Customer Updated Success",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCustomer = updateCustomer;
