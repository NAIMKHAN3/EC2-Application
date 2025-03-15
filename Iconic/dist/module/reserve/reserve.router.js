"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reserve_validation_1 = require("./reserve.validation");
const reserve_controller_1 = require("./reserve.controller");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const verifyParams_1 = require("../../middleware/verifyParams");
const router = (0, express_1.Router)();
router.post('/create-reserve', reserve_validation_1.verifyReserve, reserve_controller_1.createReserve);
router.put('/update-reserve/:id', verifyJwt_1.verifyJwt, verifyParams_1.verifyParams, reserve_validation_1.verifyReserveUpdate, reserve_controller_1.updateReserve);
router.get('/get-reserve-all', reserve_controller_1.getReserveAll);
router.get('/get-reserve-single/:id', verifyParams_1.verifyParams, reserve_controller_1.getReserveSingle);
router.delete('/delete-reserve/:id', verifyJwt_1.verifyJwt, verifyParams_1.verifyParams, reserve_controller_1.deleteReserve);
exports.default = router;
