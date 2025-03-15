"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCMS = void 0;
const express_validation_1 = require("express-validation");
const cmsValidation = {
    body: express_validation_1.Joi.object({
        companyName: express_validation_1.Joi.string().optional(),
        email: express_validation_1.Joi.string().optional(),
        companyNameBangla: express_validation_1.Joi.string().optional(),
        companyLogo: express_validation_1.Joi.string().optional(),
        companyLogoBangla: express_validation_1.Joi.string().optional(),
        footerLogo: express_validation_1.Joi.string().optional(),
        footerLogoBangla: express_validation_1.Joi.string().optional(),
        address: express_validation_1.Joi.string().optional(),
        addressBangla: express_validation_1.Joi.string().optional(),
        city: express_validation_1.Joi.string().optional(),
        cityBangla: express_validation_1.Joi.string().optional(),
        postalCode: express_validation_1.Joi.string().optional(),
        supportNumber1: express_validation_1.Joi.string().optional(),
        supportNumber2: express_validation_1.Joi.string().optional(),
        offeredImageOne: express_validation_1.Joi.string().optional(),
        offeredImageTwo: express_validation_1.Joi.string().optional(),
        offeredImageThree: express_validation_1.Joi.string().optional(),
        homePageDescription: express_validation_1.Joi.string().optional(),
        homePageDescriptionBangla: express_validation_1.Joi.string().optional(),
        facebook: express_validation_1.Joi.string().optional(),
        instagram: express_validation_1.Joi.string().optional(),
        twitter: express_validation_1.Joi.string().optional(),
        linkedin: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyCMS = (0, express_validation_1.validate)(cmsValidation, {}, {});
