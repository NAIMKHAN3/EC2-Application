"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partialInfo_controller_1 = require("./partialInfo.controller");
const verifyJwt_1 = require("../../middleware/verifyJwt");
const router = (0, express_1.Router)();
router.get('/get-partial-info', partialInfo_controller_1.getPartialInfo);
router.put('/update-partial-info/:id', verifyJwt_1.verifyJwt, partialInfo_controller_1.updatePartialInfo);
exports.default = router;
