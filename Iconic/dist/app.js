"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./router/router"));
const http_1 = require("http");
const errorHandler_1 = __importStar(require("./middleware/errorHandler"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("./config/swagger.config"));
const app = (0, express_1.default)();
const allowedOrigin = 'http://localhost:3000';
app.use((0, cors_1.default)({
    origin: "*",
    optionsSuccessStatus: 200
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const enforceHostCheck = (req, res, next) => {
    const host = req.get('host');
    if (host === 'localhost:3000') {
        next();
    }
    else {
        res.status(403).send({
            success: false,
            message: 'Forbidden'
        });
    }
};
// Use the Host check middleware
// app.use(enforceHostCheck);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.default));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await prisma.partialInfo.create({
    //     data:{
    //         partialPercentage: 50,
    //         time: "2 Hours"
    //     }
    // })
    // const host = req.get('host');
    // console.log(req)
    res.status(200)
        .send({
        success: true,
        message: 'Iconic Server Is Running'
    });
}));
app.use('/api/v1', router_1.default);
app.use(errorHandler_1.notfoundandler);
app.use(errorHandler_1.default);
const server = (0, http_1.createServer)(app);
exports.default = server;
