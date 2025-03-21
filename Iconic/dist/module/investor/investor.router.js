"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const investor_validation_1 = require("./investor.validation");
const investor_controller_1 = require("./investor.controller");
const router = (0, express_1.Router)();
router.post('/create-investor', investor_validation_1.verifyInvestor, investor_controller_1.createInvestor);
router.get('/get-investor-all', investor_controller_1.getInvestorAll);
router.get('/get-investor-single/:id', investor_controller_1.getInvestorSingle);
router.put('/update-investor/:id', investor_validation_1.verifyUpdateInvestor, investor_controller_1.updateInvestor);
router.delete('/delete-investor/:id', investor_controller_1.deleteInvestor);
exports.default = router;
