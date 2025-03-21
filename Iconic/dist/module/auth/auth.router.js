"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const verifyOtp_1 = require("../../middleware/verifyOtp");
const router = (0, express_1.Router)();
router.post('/create-user', auth_validation_1.verifyUserReg, auth_controller_1.createUser);
router.post('/login-user', auth_validation_1.verifyUserLogin, auth_controller_1.loginUser);
router.post('/change-password', verifyJwt_1.verifyJwt, auth_validation_1.verifyChangePassword, auth_controller_1.changePassword);
router.post('/forget-password-request', auth_validation_1.verifyForget, auth_controller_1.forgetPasswordRequest);
router.post('/otp-verify', verifyOtp_1.verifyOTP, auth_validation_1.verifyOtpVerify, auth_controller_1.forgetOTPVerify);
router.post('/forget-changePassword', verifyOtp_1.verifyOTP, auth_validation_1.verifyForgetChangePassword, auth_controller_1.changePasswordInForgetPassword);
exports.default = router;
