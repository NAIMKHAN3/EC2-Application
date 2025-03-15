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
exports.authorizeCollection = exports.updateCollection = exports.deleteCollection = exports.getCollectionSingle = exports.getCollectionAccountsDashboard = exports.getCollectionAll = exports.createCollection = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.collection.create({
            data: req.body
        });
        yield prisma_1.default.coachConfig.update({
            where: {
                id: result.coachConfigId
            },
            data: {
                tokenAvailable: {
                    decrement: result.token,
                }
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Created Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCollection = createCollection;
const getCollectionAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
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
                    { file: { contains: search, } },
                    { coachConfig: { coachNo: { contains: search, } } },
                    { counter: { name: { contains: search, } } },
                ],
            });
        }
        const result = yield prisma_1.default.collection.findMany({
            where: {
                supervisorId: id,
                AND: whereCondition
            },
            include: {
                supervisor: {
                    select: {
                        userName: true,
                    }
                },
                counter: {
                    select: {
                        name: true,
                        address: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        registrationNo: true,
                    }
                },
                authorize: {
                    select: {
                        userName: true,
                    }
                }
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.collection.count({
            where: {
                supervisorId: id,
                AND: whereCondition
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Collection retrieved Success',
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
exports.getCollectionAll = getCollectionAll;
const getCollectionAccountsDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                    { file: { contains: search, } },
                ],
            });
        }
        const result = yield prisma_1.default.collection.findMany({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
            include: {
                supervisor: {
                    select: {
                        userName: true,
                    }
                },
                counter: {
                    select: {
                        name: true,
                        address: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        registrationNo: true,
                    }
                }
            },
            skip: skip * take,
            take,
        });
        const total = yield prisma_1.default.collection.count({
            where: {
                AND: whereCondition,
                authorizeStatus: false,
            },
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'All Collection retrieved Success',
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
exports.getCollectionAccountsDashboard = getCollectionAccountsDashboard;
const getCollectionSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.collection.findUnique({
            where: {
                id
            },
            include: {
                supervisor: {
                    select: {
                        userName: true,
                    }
                },
                counter: {
                    select: {
                        name: true,
                        address: true,
                    }
                },
                coachConfig: {
                    select: {
                        coachNo: true,
                        registrationNo: true,
                    }
                }
            },
        });
        if (!result) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Collection Not Found'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Single Collection retrieved Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCollectionSingle = getCollectionSingle;
const deleteCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCollection = yield prisma_1.default.collection.findUnique({
            where: {
                id
            },
        });
        if (!findCollection) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Collection Not Found'
            });
        }
        const result = yield prisma_1.default.collection.delete({
            where: {
                id
            }
        });
        if (!result) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: 'Collection Not Deleted'
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Delete Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCollection = deleteCollection;
const updateCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findCollection = yield prisma_1.default.collection.findUnique({
            where: {
                id
            }
        });
        if (!findCollection) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Collection Not Found'
            });
        }
        if (!findCollection.edit) {
            return res.status(403).send({
                success: false,
                statusCode: 403,
                message: 'Collection cannot be updated'
            });
        }
        const result = yield prisma_1.default.collection.update({
            where: {
                id,
            },
            data: req.body
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Updated Success',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCollection = updateCollection;
const authorizeCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionId = Number(req.params.id);
        const { edit, accounts } = req.body;
        if (edit) {
            yield prisma_1.default.collection.update({
                where: {
                    id: collectionId
                },
                data: {
                    edit: true
                }
            });
        }
        else {
            if (!accounts.length) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: 'Accounts is required'
                });
            }
            const { id } = req.user;
            const findCollection = yield prisma_1.default.collection.findUnique({
                where: {
                    id: collectionId
                }
            });
            if (!findCollection) {
                return res.status(404).send({
                    success: false,
                    statusCode: 404,
                    message: 'Collection Not Found'
                });
            }
            const result = yield prisma_1.default.collection.update({
                where: {
                    id: collectionId,
                },
                data: {
                    authorizeStatus: true,
                    authorizeBy: id
                }
            });
            for (let acc of accounts) {
                const findAccount = yield prisma_1.default.account.findUnique({
                    where: {
                        id: acc.accountId
                    }
                });
                if (!findAccount) {
                    return res.status(400).send({
                        success: false,
                        statusCode: 400,
                        message: 'Account not found'
                    });
                }
                if (result.collectionType === "CounterCollection") {
                    yield prisma_1.default.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: {
                                increment: acc.amount
                            }
                        }
                    });
                }
                else {
                    yield prisma_1.default.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: {
                                decrement: acc.amount
                            }
                        }
                    });
                }
            }
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Collection Authorize Success',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.authorizeCollection = authorizeCollection;
