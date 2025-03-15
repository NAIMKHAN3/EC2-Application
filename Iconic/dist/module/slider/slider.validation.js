"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySlider = void 0;
const express_validation_1 = require("express-validation");
const SliderValidation = {
    body: express_validation_1.Joi.object({
        image: express_validation_1.Joi.string().required(),
    })
};
exports.verifySlider = (0, express_validation_1.validate)(SliderValidation);
