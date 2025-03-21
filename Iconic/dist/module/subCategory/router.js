"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("./validation");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/create-sub-category', validation_1.verifySubCategory, controller_1.createSubCategory);
router.put('/update-sub-category/:id', validation_1.verifySubCategoryUpdate, controller_1.updateSubCategory);
router.get('/get-sub-category-all', controller_1.getSubCategoryAll);
router.get('/get-sub-category-single/:id', controller_1.getSubCategorySingle);
router.delete('/delete-Sub-category/:id', controller_1.deleteSubCategory);
exports.default = router;
