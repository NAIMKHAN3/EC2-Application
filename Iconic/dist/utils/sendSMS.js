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
exports.sendSMS = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const smsUrl = 'http://bulksmsbd.net/api/smsapi';
const sendSMS = (number, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(smsUrl, {
            data: {
                api_key: process.env.SMS_API_KEY,
                senderid: process.env.SENDER_ID,
                number: number,
                message: message,
                type: 'text',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
});
exports.sendSMS = sendSMS;
