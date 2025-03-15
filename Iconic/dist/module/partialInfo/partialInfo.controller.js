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
exports.getPartialInfo = exports.updatePartialInfo = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const updatePartialInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma_1.default.partialInfo.update({
            where: {
                id,
            },
            data: req.body,
        });
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Partial Info Updated Success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updatePartialInfo = updatePartialInfo;
const getPartialInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.partialInfo.findFirst();
        res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Get Partial Info Success",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getPartialInfo = getPartialInfo;
