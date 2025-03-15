"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const fcm_notify_1 = __importDefault(require("fcm-notify"));
const serverKey = "../config/pos-software-test-firebase-adminsdk-9uk3u-2dd43ecc1c.json";
var fcm = new fcm_notify_1.default(serverKey);
const pushNotification = (token, title, body, data) => {
    let message = {
        token,
        notification: {
            title,
            body,
        },
        data: {
            notification: data,
        }
    };
    //@ts-ignore
    return fcm.send(message, function (err, response) {
    });
};
exports.default = pushNotification;
