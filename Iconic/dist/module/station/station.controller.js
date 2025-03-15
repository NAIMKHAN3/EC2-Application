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
exports.updateStation = exports.deleteStation = exports.getStationSingle = exports.getStationAll = exports.createStation = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createStation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findStation = yield prisma_1.default.station.findFirst({
            where: {
                name: req.body.name
            }
        });
        if (findStation) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Station Already Exists'
            });
        }
        const result = yield prisma_1.default.station.create({
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Station Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createStation = createStation;
const getStationAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                ],
            });
        }
        const result = yield prisma_1.default.station.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.station.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Station retrieved Success',
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
exports.getStationAll = getStationAll;
const getStationSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.station.findUnique({
            where: {
                id
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Station Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Station retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getStationSingle = getStationSingle;
const deleteStation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findStation = yield prisma_1.default.station.findUnique({
            where: {
                id
            },
        });
        if (!findStation) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Station Not Found'
            });
        }
        const result = yield prisma_1.default.station.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Station Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Station Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteStation = deleteStation;
const updateStation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findStation = yield prisma_1.default.station.findUnique({
            where: {
                id
            }
        });
        if (!findStation) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Station Not Found'
            });
        }
        if (req.body.name) {
            const findName = yield prisma_1.default.station.findFirst({
                where: {
                    name: req.body.name
                }
            });
            if (findName && findStation.id !== findName.id) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Name Already Exists'
                });
            }
        }
        const result = yield prisma_1.default.station.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Station Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateStation = updateStation;
