"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const verifyAdmin = (req, res, next) => {
    try {
        const { role } = req.user;
        if (role === "ADMIN") {
            return next();
        }
        return res.status(400).send({
            status: false, message: "You are not a admin"
        });
    }
    catch (err) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};
exports.verifyAdmin = verifyAdmin;
