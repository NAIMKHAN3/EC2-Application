"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloude_name,
    api_key: config_1.default.cloude_api_key,
    api_secret: config_1.default.cloude_secret_key
});
const DEFAULT_ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
const DEFAULT_MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const uploader = ({ allowedFileTypes = DEFAULT_ALLOWED_FILE_TYPES, errorMessage = "Invalid file type", maxFileSize = DEFAULT_MAX_FILE_SIZE, uploadPath = "uploads", }) => {
    const UPLOADS_FOLDER = path_1.default.join(__dirname, `../../public/${uploadPath}`);
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            folder: 'uploads', // Change this to your desired folder name
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
        }, // Use an assertion here
    });
    const fileFilter = (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(errorMessage));
        }
    };
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: maxFileSize,
        },
    });
    return upload;
};
exports.default = uploader;
