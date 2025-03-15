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
exports.changePasswordInForgetPassword = exports.forgetOTPVerify = exports.forgetPasswordRequest = exports.changePassword = exports.loginUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_utils_1 = require("../../utils/token.utils");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password, contactNo = 'null', } = req.body;
        const isExistingUser = yield prisma_1.default.user.findFirst({ where: { userName } });
        const isExistingPhone = yield prisma_1.default.user.findFirst({ where: { contactNo } });
        if (isExistingUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Already Exist"
            });
        }
        if (isExistingPhone) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Phone Already Exist"
            });
        }
        req.body.password = yield bcrypt_1.default.hash(password, 12);
        const userInfo = yield prisma_1.default.user.create({
            data: req.body,
            select: {
                id: true,
                userName: true,
                email: true,
                contactNo: true,
                address: true,
                role: true,
                avatar: true
            }
        });
        const accessToken = (0, token_utils_1.createToken)(userInfo, "ACCESS");
        const refreshToken = (0, token_utils_1.createToken)(userInfo, "REFRESH");
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        });
        res.status(201).send({
            success: true,
            statusCode: 201,
            message: 'User Created Successfully',
            accessToken
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        let findUser;
        findUser = yield prisma_1.default.user.findFirst({ where: { userName, active: true }, include: { role: true, counter: true } });
        if (!findUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            });
        }
        if (findUser.blockDate) {
            //@ts-ignore
            const diffInMillis = new Date() - findUser.blockDate;
            const diffInMinutes = diffInMillis / (1000 * 60);
            const minute = parseInt(diffInMinutes.toString());
            if (minute < 15) {
                return res.status(400).send({
                    success: false,
                    statusCode: 400,
                    message: `User Blocked Please Try Again After ${15 - minute} minutes`
                });
            }
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, findUser.password);
        if (!isPasswordCorrect) {
            findUser = yield prisma_1.default.user.update({
                where: {
                    id: findUser.id
                },
                data: {
                    count: findUser.count + 1
                }
            });
            if (findUser.count > 2) {
                findUser = yield prisma_1.default.user.update({
                    where: {
                        id: findUser.id
                    },
                    data: {
                        blockDate: new Date()
                    }
                });
            }
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Password Incorrect"
            });
        }
        const userInfo = {
            id: findUser.id,
            counterId: findUser.counterId,
            name: findUser.userName,
            email: findUser.email,
            address: findUser.address,
            counter: findUser.counter,
            contactNo: findUser.contactNo,
            role: findUser === null || findUser === void 0 ? void 0 : findUser.role.name,
            avatar: findUser.avatar || null
        };
        const accessToken = (0, token_utils_1.createToken)(userInfo, "ACCESS");
        const refreshToken = (0, token_utils_1.createToken)(userInfo, "REFRESH");
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/'
        });
        yield prisma_1.default.user.update({
            where: {
                id: findUser.id
            },
            data: {
                count: 0,
                blockDate: null
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'User Login Successfully',
            accessToken
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginUser = loginUser;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, oldPassword } = req.body;
        const { id } = req.user;
        const user = yield prisma_1.default.user.findFirst({ where: { id } });
        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Password Incorrect"
            });
        }
        const bcryptPassword = yield bcrypt_1.default.hash(newPassword, 12);
        yield prisma_1.default.user.update({
            where: {
                id
            },
            data: {
                password: bcryptPassword
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Password Change Successfully',
        });
    }
    catch (err) {
    }
});
exports.changePassword = changePassword;
const forgetPasswordRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = req.body;
        const findUser = yield prisma_1.default.user.findFirst({
            where: {
                userName
            }
        });
        if (!findUser) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const userInfo = {
            id: findUser.id,
            counterId: findUser.counterId,
            name: findUser.userName,
            email: findUser.email,
            address: findUser.address,
            contactNo: findUser.contactNo,
            avatar: findUser.avatar || null,
            otp,
        };
        const otpToken = (0, token_utils_1.createToken)(userInfo, "OTP");
        yield prisma_1.default.forgetOTP.deleteMany({
            where: {
                userName: findUser.userName
            }
        });
        yield prisma_1.default.forgetOTP.create({
            data: {
                userName: findUser.userName,
                otp,
                token: otpToken,
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'OTP Send Successfully',
            data: {
                otp,
                otpToken
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.forgetPasswordRequest = forgetPasswordRequest;
const forgetOTPVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, otpToken } = req.body;
        const findOtp = yield prisma_1.default.forgetOTP.findFirst({
            where: {
                token: otpToken
            }
        });
        if (!findOtp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "token invalid",
            });
        }
        if (otp !== findOtp.otp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "OTP does not match",
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'OTP Match Successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.forgetOTPVerify = forgetOTPVerify;
const changePasswordInForgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, otpToken, newPassword } = req.body;
        const findOtp = yield prisma_1.default.forgetOTP.findFirst({
            where: {
                token: otpToken
            }
        });
        if (!findOtp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "token invalid",
            });
        }
        if (otp !== findOtp.otp) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "OTP does not match",
            });
        }
        yield prisma_1.default.forgetOTP.delete({
            where: {
                id: findOtp.id,
            }
        });
        const user = yield prisma_1.default.user.findFirst({ where: { userName: findOtp.userName } });
        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User Not Found"
            });
        }
        const bcryptPassword = yield bcrypt_1.default.hash(newPassword, 12);
        yield prisma_1.default.user.update({
            where: {
                id: user.id
            },
            data: {
                password: bcryptPassword
            }
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Password Change Successfully',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.changePasswordInForgetPassword = changePasswordInForgetPassword;
