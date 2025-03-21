"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySubCategoryUpdate = exports.verifySubCategory = void 0;
const express_validation_1 = require("express-validation");
const SubCategoryValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifySubCategory = (0, express_validation_1.validate)(SubCategoryValidation);
const SubCategoryUpdateValidation = {
    body: express_validation_1.Joi.object({
        name: express_validation_1.Joi.string().required(),
    })
};
exports.verifySubCategoryUpdate = (0, express_validation_1.validate)(SubCategoryUpdateValidation);
