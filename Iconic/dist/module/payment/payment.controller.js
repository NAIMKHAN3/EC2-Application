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
exports.refundPaymentStatus = exports.refundPayment = exports.webhook = exports.paymentInstance = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const config_1 = __importDefault(require("../../config"));
const axios_1 = __importDefault(require("axios"));
const paymentInstanceURL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const paymentSuccessCheckURL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";
const refundPaymentURL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";
const refundPaymentStatusURL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";
const store_id = config_1.default.sslStoreId;
const store_passwd = config_1.default.sslStorePass;
const paymentInstance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timestamp = Date.now();
        const url = paymentInstanceURL;
        const is_live = false; //true for live, false for sandbox
        const orderId = Number(req.params.id);
        const findOrder = yield prisma_1.default.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                orderSeat: true,
            }
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "Order not found"
            });
        }
        else if (findOrder.payment) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Payment already made"
            });
        }
        else if (findOrder.counterId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "This order payment only counter not online payment"
            });
        }
        let productName = "";
        for (const seat of findOrder.orderSeat) {
            productName += seat.seat + " ";
        }
        const tran_id = `tran_id-${timestamp}`;
        const data = {
            store_id,
            store_passwd,
            total_amount: findOrder.paymentType === "FULL" ? findOrder.amount : findOrder.partial ? findOrder.dueAmount : findOrder.paymentAmount,
            currency: 'BDT',
            tran_id,
            success_url: `http://iconicexpress.com.s3-website.ap-south-1.amazonaws.com/payment-success/${tran_id}`,
            fail_url: 'http://iconicexpress.com.s3-website.ap-south-1.amazonaws.com/payment-failed',
            cancel_url: 'http://iconicexpress.com.s3-website.ap-south-1.amazonaws.com/payment-canceled',
            ipn_url: 'http://localhost:5500/api/v1/payment/webhook',
            shipping_method: 'N/A',
            product_name: productName,
            product_category: 'BUS',
            product_profile: 'general',
            cus_name: findOrder.customerName || "N/A",
            cus_email: findOrder.email || "N/A",
            cus_add1: findOrder.address || "N/A",
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: findOrder.nationality || "N/A",
            cus_phone: findOrder.phone || "N/A",
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
            multi_card_name: 'mastercard',
            value_a: 'ref001_A',
            value_b: 'ref002_B',
            value_c: 'ref003_C',
            value_d: 'ref004_D'
        };
        const result = yield axios_1.default.post(url, data, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${store_id}:${store_passwd}`).toString('base64')}`
            }
        });
        if (result.data.status === "SUCCESS") {
            yield prisma_1.default.payment.create({
                data: {
                    orderId: findOrder.id,
                    amount: findOrder.paymentType === "FULL" ? findOrder.amount : findOrder.partial ? findOrder.dueAmount : findOrder.paymentAmount,
                    transId: tran_id,
                    userPhone: findOrder.phone,
                    sessionKey: result.data.sessionkey,
                    userEmail: findOrder.email || "N/A",
                }
            });
        }
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Payment request sent successfully',
            data: {
                status: result.data.status,
                url: result.data.GatewayPageURL,
                sessionKey: result.data.sessionkey
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.paymentInstance = paymentInstance;
const webhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tran_id = req.params.id;
        // const { val_id, tran_id, amount, card_type, store_id, status } = req.body;
        // if (store_id !== config.sslStoreId) {
        //     return res.status(400).send({ success: false, message: 'Invalid store ID' });
        // }
        let findPayment = yield prisma_1.default.payment.findUnique({
            where: {
                transId: tran_id
            },
            include: {
                order: true,
            }
        });
        if (!findPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payment not found'
            });
        }
        else if (findPayment.status === "Success") {
            return res.status(200).send({
                success: true,
                message: 'Webhook received successfully',
                data: findPayment
            });
        }
        let findOrder = yield prisma_1.default.order.findUnique({
            where: {
                id: findPayment === null || findPayment === void 0 ? void 0 : findPayment.orderId
            },
        });
        if (!findOrder) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Order not found'
            });
        }
        const { data } = yield axios_1.default.get(`${paymentSuccessCheckURL}?sessionkey=${findPayment.sessionKey}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`);
        if ((data === null || data === void 0 ? void 0 : data.status) === 'VALID') {
            if (findOrder.paymentType === "FULL") {
                yield prisma_1.default.order.update({
                    where: {
                        id: findOrder.id
                    },
                    data: {
                        status: 'Success',
                        payment: true,
                        paymentAmount: Number(data.amount),
                        dueAmount: 0,
                    },
                });
                yield prisma_1.default.orderSeat.updateMany({
                    where: {
                        orderId: findOrder.id
                    },
                    data: {
                        status: 'Success',
                    },
                });
            }
            else if (findOrder.paymentType === "PARTIAL" && !findOrder.partial) {
                yield prisma_1.default.order.update({
                    where: { id: findOrder.id },
                    data: {
                        partial: true,
                        partialPaymentAmount: Number(data.amount),
                        dueAmount: findOrder.amount - Number(data.amount),
                        payment: (findOrder.dueAmount - Number(data.amount) === 0) ? true : false,
                        paymentAmount: Number(data.amount),
                        status: (findOrder.dueAmount - Number(data.amount) === 0) ? "Success" : "Pending",
                    },
                });
            }
            else if (findOrder.paymentType === "PARTIAL" && findOrder.partial) {
                yield prisma_1.default.order.update({
                    where: { id: findOrder.id },
                    data: {
                        partialPaymentAmount: findOrder.partialPaymentAmount + Number(data.amount),
                        dueAmount: findOrder.dueAmount - Number(data.amount),
                        payment: (findOrder.dueAmount - Number(data.amount) === 0) ? true : false,
                        paymentAmount: findOrder.paymentAmount + Number(data.amount),
                        status: (findOrder.dueAmount - Number(data.amount) === 0) ? "Success" : "Pending",
                    },
                });
                yield prisma_1.default.orderSeat.updateMany({
                    where: { id: findOrder.id },
                    data: {
                        status: (findOrder.dueAmount - Number(data.amount) === 0) ? "Success" : "Pending",
                    },
                });
            }
            findPayment = yield prisma_1.default.payment.update({
                where: { transId: tran_id },
                data: {
                    status: 'Success',
                    valId: data.val_id,
                    bankTransId: data.bank_tran_id,
                    cardType: data.card_type,
                    cardIssuer: data.card_issuer,
                    card_brand: data.card_brand,
                },
                include: {
                    order: true,
                }
            });
        }
        else if (data.status === "FAILED") {
            yield prisma_1.default.payment.update({
                where: { transId: tran_id },
                data: { status: 'Failed', },
            });
        }
        res.status(200).send({
            success: true,
            message: 'Webhook received successfully',
            data: findPayment
        });
    }
    catch (err) {
        next(err);
    }
});
exports.webhook = webhook;
const refundPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { paymentId, whyRefund } = req.body;
        const findPayment = yield prisma_1.default.payment.findUnique({
            where: {
                id: paymentId
            },
        });
        if (!findPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Payment not found'
            });
        }
        const findRefund = yield prisma_1.default.refundPayment.findFirst({
            where: {
                paymentId: paymentId
            },
        });
        if (findRefund) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Refund Request Already Initialized'
            });
        }
        const result = yield axios_1.default.get(`${refundPaymentURL}?bank_tran_id=${findPayment.bankTransId}&refund_amount=${findPayment.amount}&refund_remarks=${whyRefund}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`);
        if ((result === null || result === void 0 ? void 0 : result.data.APIConnect) === "DONE" && result.data.status === "success") {
            const data = {
                paymentId,
                refundAmount: findPayment.amount,
                refundRemarks: whyRefund,
                refundStatus: (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.status,
                refundRefId: (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.refund_ref_id
            };
            const refundInfo = yield prisma_1.default.refundPayment.create({
                data,
            });
            res.status(200).send({
                success: true,
                statusCode: 200,
                message: 'Refund Payment Initialized Successfully!',
                data: refundInfo
            });
        }
        else {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: (_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.errorReason,
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.refundPayment = refundPayment;
const refundPaymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const findRefundPayment = yield prisma_1.default.refundPayment.findFirst({
            where: {
                paymentId: id
            },
        });
        if (!findRefundPayment) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'Refund Payment not found'
            });
        }
        const { data } = yield axios_1.default.get(`${refundPaymentStatusURL}?refund_ref_id=${findRefundPayment.refundRefId}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`);
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Refund Payment Status Check Successful!',
            data: data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.refundPaymentStatus = refundPaymentStatus;
