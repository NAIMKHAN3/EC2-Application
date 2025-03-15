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
exports.verifyPermission = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyPermission = (name, access) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.user;
    const findPermissionType = yield prisma_1.default.permissionType.findFirst({
        where: {
            name: name
        }
    });
    if (!findPermissionType) {
        return res.status(401).send({
            success: false,
            message: "Access Denied Not found Permission Type"
        });
    }
    const findPermission = yield prisma_1.default.permission.findFirst({
        where: {
            name: access,
            permissionTypeId: findPermissionType.id
        }
    });
    if (findPermission) {
        const findUserPermission = yield prisma_1.default.userPermission.findFirst({
            where: {
                userId: id,
                permissionId: findPermission === null || findPermission === void 0 ? void 0 : findPermission.id
            }
        });
        const findRolePermission = yield prisma_1.default.rolePermission.findFirst({
            where: {
                role,
                permissionId: findPermission === null || findPermission === void 0 ? void 0 : findPermission.id
            }
        });
        if (findUserPermission || findRolePermission) {
            next(); // User has the required permission, proceed to the next middleware
        }
        else {
            return res.status(401).send({
                success: false,
                message: "Access Denied Unauthorized Permission"
            });
        }
    }
    else {
        return res.status(401).send({
            success: false,
            message: "Access Denied Unauthorized Permission"
        });
    }
});
exports.verifyPermission = verifyPermission;
