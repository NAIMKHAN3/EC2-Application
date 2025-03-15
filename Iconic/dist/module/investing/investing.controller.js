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
exports.getInvesting = exports.deleteInvesting = exports.createInvestingOut = exports.createInvestingIn = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const client_1 = require("@prisma/client");
const createInvestingIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interest, note, investorId, investingBalances, investingType, payments } = req.body;
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const findInvestor = yield prisma.investor.findFirst({
                where: {
                    id: investorId
                }
            });
            if (!findInvestor) {
                return res.status(400).send({
                    success: false,
                    message: "Investor Not Found"
                });
            }
            const result = yield prisma.investing.create({
                data: {
                    investorId,
                    investingBalances,
                    investingType,
                    type: "In",
                    interest,
                    note
                }
            });
            if (payments) {
                for (const payment of payments) {
                    yield prisma.internalPayment.create({
                        data: {
                            investingId: result.id,
                            investorId: investorId,
                            accountId: payment.accountId,
                            paymentAmount: payment.paymentAmount,
                            type: "Credit",
                            subject: "Invest",
                            person: client_1.Person.Investor,
                        },
                    });
                    const findAccount = yield prisma.account.findUnique({
                        where: {
                            id: payment.accountId
                        }
                    });
                    if (findAccount) {
                        let newBalance = (findAccount === null || findAccount === void 0 ? void 0 : findAccount.currentBalance) + payment.paymentAmount;
                        yield prisma.account.update({
                            where: {
                                id: payment.accountId
                            },
                            data: {
                                currentBalance: newBalance
                            }
                        });
                    }
                }
            }
            if (result && investingBalances) {
                if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    if (investingBalances <= findInvestor.dueAmount) {
                        yield prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                dueAmount: findInvestor.dueAmount - investingBalances
                            }
                        });
                    }
                    else {
                        yield prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                dueAmount: 0,
                                advanceAmount: investingBalances - findInvestor.dueAmount
                            }
                        });
                    }
                }
                else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                    yield prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            advanceAmount: findInvestor.advanceAmount + investingBalances
                        }
                    });
                }
                else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    yield prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            advanceAmount: investingBalances
                        }
                    });
                }
            }
            return result;
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'Investing In Created Done',
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createInvestingIn = createInvestingIn;
const createInvestingOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { investorId, investingBalances, investingType, payments } = req.body;
        const transaction = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const findInvestor = yield prisma.investor.findFirst({
                where: {
                    id: investorId
                }
            });
            if (!findInvestor) {
                return res.status(400).send({
                    success: false,
                    message: "Investor Not Found"
                });
            }
            const result = yield prisma.investing.create({
                data: {
                    investorId,
                    investingBalances,
                    investingType,
                    type: "Out"
                }
            });
            if (payments) {
                for (const payment of payments) {
                    const paymentResult = yield prisma.internalPayment.create({
                        data: {
                            investingId: result.id,
                            investorId: investorId,
                            accountId: payment.accountId,
                            paymentAmount: payment.paymentAmount,
                            type: "Debit",
                            subject: "InvestOut",
                            person: client_1.Person.Investor,
                        },
                    });
                    const findAccount = yield prisma.account.findUnique({
                        where: {
                            id: payment.accountId
                        }
                    });
                    if (findAccount) {
                        let newBalance = (findAccount === null || findAccount === void 0 ? void 0 : findAccount.currentBalance) - payment.paymentAmount;
                        yield prisma.account.update({
                            where: {
                                id: payment.accountId
                            },
                            data: {
                                currentBalance: newBalance
                            }
                        });
                    }
                }
            }
            if (result && investingBalances) {
                if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    yield prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: findInvestor.dueAmount + investingBalances
                        }
                    });
                }
                else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                    if (investingBalances <= findInvestor.advanceAmount) {
                        yield prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                advanceAmount: findInvestor.advanceAmount - investingBalances
                            }
                        });
                    }
                    else {
                        yield prisma.investor.update({
                            where: {
                                id: findInvestor.id
                            },
                            data: {
                                advanceAmount: 0,
                                dueAmount: investingBalances - findInvestor.advanceAmount
                            }
                        });
                    }
                }
                else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                    yield prisma.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: investingBalances
                        }
                    });
                }
            }
            return result;
        }), {
            maxWait: 500000,
            timeout: 1000000,
        });
        res.status(201).send({
            success: true,
            statusCode: 200,
            message: 'Investing out Created Done',
            data: transaction
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createInvestingOut = createInvestingOut;
const deleteInvesting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findInvesting = yield prisma_1.default.investing.findFirst({
            where: {
                id: id
            }
        });
        const findInvestor = yield prisma_1.default.investor.findFirst({
            where: {
                id: findInvesting === null || findInvesting === void 0 ? void 0 : findInvesting.investorId
            }
        });
        if (!findInvesting) {
            return res.status(404).send({
                success: false,
                message: 'Investing not fount',
            });
        }
        if (!findInvestor) {
            return res.status(404).send({
                success: false,
                message: 'Investor not fount',
            });
        }
        const investingBalances = findInvesting.investingBalances;
        if (findInvesting.type === "Out") {
            if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                if (investingBalances <= findInvestor.dueAmount) {
                    yield prisma_1.default.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: findInvestor.dueAmount - investingBalances
                        }
                    });
                }
                else {
                    yield prisma_1.default.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: 0,
                            advanceAmount: investingBalances - findInvestor.dueAmount
                        }
                    });
                }
            }
            else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                yield prisma_1.default.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        advanceAmount: findInvestor.advanceAmount + investingBalances
                    }
                });
            }
            else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                yield prisma_1.default.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        advanceAmount: investingBalances
                    }
                });
            }
        }
        else {
            if (findInvestor.dueAmount && !findInvestor.advanceAmount) {
                yield prisma_1.default.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        dueAmount: findInvestor.dueAmount + investingBalances
                    }
                });
            }
            else if (!findInvestor.dueAmount && findInvestor.advanceAmount) {
                if (investingBalances <= findInvestor.advanceAmount) {
                    yield prisma_1.default.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            dueAmount: 0,
                            advanceAmount: findInvestor.advanceAmount - investingBalances
                        }
                    });
                }
                else {
                    yield prisma_1.default.investor.update({
                        where: {
                            id: findInvestor.id
                        },
                        data: {
                            advanceAmount: 0,
                            dueAmount: investingBalances - findInvestor.advanceAmount
                        }
                    });
                }
            }
            else if (!findInvestor.dueAmount && !findInvestor.advanceAmount) {
                yield prisma_1.default.investor.update({
                    where: {
                        id: findInvestor.id
                    },
                    data: {
                        dueAmount: investingBalances
                    }
                });
            }
        }
        const payments = yield prisma_1.default.internalPayment.findMany({
            where: {
                investingId: id
            }
        });
        if (payments.length > 0) {
            for (const payment of payments) {
                const findAccount = yield prisma_1.default.account.findFirst({
                    where: {
                        id: payment.accountId
                    }
                });
                if (!findAccount) {
                    return res.status(404).send({
                        success: false,
                        message: 'Account not fount',
                    });
                }
                if (findInvesting.type === 'In') {
                    yield prisma_1.default.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: findAccount.currentBalance - payment.paymentAmount
                        }
                    });
                }
                else {
                    yield prisma_1.default.account.update({
                        where: {
                            id: findAccount.id
                        },
                        data: {
                            currentBalance: findAccount.currentBalance + payment.paymentAmount
                        }
                    });
                }
            }
        }
        yield prisma_1.default.internalPayment.deleteMany({
            where: {
                investingId: id
            }
        });
        const result = yield prisma_1.default.investing.delete({ where: { id } });
        res.status(201).send({
            success: true,
            message: 'Investing delete Done',
            data: result
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteInvesting = deleteInvesting;
const getInvesting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, size, sortOrder, search, type } = req.query;
        let findType = type || client_1.InvestType.In;
        if (typeof type === 'string') {
            findType = type;
        }
        else {
            findType = client_1.InvestType.In;
        }
        let skip = parseInt(page) - 1 || 0;
        const take = parseInt(size) || 10;
        const order = (sortOrder === null || sortOrder === void 0 ? void 0 : sortOrder.toLowerCase()) === "desc" ? "desc" : "asc";
        let result = yield prisma_1.default.investing.findMany({
            where: {
                //@ts-ignore
                type: findType,
            },
            include: {
                investor: {
                    select: {
                        name: true,
                    }
                },
                InternalPayment: {
                    select: {
                        account: {
                            select: {
                                accountName: true,
                            }
                        }
                    }
                }
            },
            skip: skip * take,
            take,
        });
        let total = yield prisma_1.default.investing.count();
        res.status(201).send({
            success: true,
            message: 'Investing get Done',
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
exports.getInvesting = getInvesting;
