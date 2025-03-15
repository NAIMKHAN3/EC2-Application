"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerPath = path_1.default.join(process.cwd(), "swagger.yaml");
const swaggerConfig = yamljs_1.default.load(swaggerPath);
exports.default = swaggerConfig;
