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
exports.updateRoute = exports.deleteRoute = exports.getRouteSingle = exports.getRouteAll = exports.createRoute = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { viaStations } = _a, data = __rest(_a, ["viaStations"]);
        const result = yield prisma_1.default.route.create({
            data
        });
        for (const via of viaStations) {
            yield prisma_1.default.viaRoute.create({
                data: {
                    routeId: result.id,
                    stationId: via
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Route Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createRoute = createRoute;
const getRouteAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { via: { contains: search, } },
                    { routeName: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.route.findMany({
            where: {
                AND: whereCondition
            },
            skip: skip * take,
            take,
            select: {
                routeName: true,
                id: true
            },
        });
        const total = yield prisma_1.default.route.count();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Route retrieved Success',
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
exports.getRouteAll = getRouteAll;
const getRouteSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.route.findUnique({
            where: {
                id
            },
            include: {
                fromStation: true,
                toStation: true,
                viaRoute: {
                    include: {
                        route: true,
                        station: true
                    }
                }
            }
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Route retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getRouteSingle = getRouteSingle;
const deleteRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findRoute = yield prisma_1.default.route.findUnique({
            where: {
                id
            },
        });
        if (!findRoute) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            });
        }
        yield prisma_1.default.viaRoute.deleteMany({
            where: {
                routeId: findRoute.id
            }
        });
        const result = yield prisma_1.default.route.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Route Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Route Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteRoute = deleteRoute;
const updateRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _b = req.body, { viaStations } = _b, data = __rest(_b, ["viaStations"]);
        const id = Number(req.params.id);
        const findRoute = yield prisma_1.default.route.findUnique({
            where: {
                id
            }
        });
        if (!findRoute) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Route Not Found'
            });
        }
        const result = yield prisma_1.default.route.update({
            where: {
                id,
            },
            data
        });
        yield prisma_1.default.viaRoute.deleteMany({
            where: {
                routeId: id
            }
        });
        for (const via of viaStations) {
            yield prisma_1.default.viaRoute.create({
                data: {
                    routeId: result.id,
                    stationId: via
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Route Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateRoute = updateRoute;
