"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const driver_controller_1 = require("./driver.controller");
const driver_validation_1 = require("./driver.validation");
const router = (0, express_1.Router)();
router.post('/create-driver', driver_validation_1.verifyDriverReg, driver_controller_1.createDriver);
router.get('/get-driver-all', driver_controller_1.getDriverAll);
router.get('/get-driver-single/:id', driver_controller_1.getDriverSingle);
router.put('/update-driver/:id', driver_validation_1.verifyDriverUpdate, driver_controller_1.updateDriver);
router.delete('/delete-driver/:id', driver_controller_1.deleteDriver);
exports.default = router;
