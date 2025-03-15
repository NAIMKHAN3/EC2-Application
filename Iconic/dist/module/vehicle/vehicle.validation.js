"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyVehicleUpdate = exports.verifyVehicle = void 0;
const express_validation_1 = require("express-validation");
const vehicleValidation = {
    body: express_validation_1.Joi.object({
        registrationNo: express_validation_1.Joi.string().required(),
        registrationFile: express_validation_1.Joi.string().required(),
        registrationExpiryDate: express_validation_1.Joi.string().required(),
        fitnessExpiryDate: express_validation_1.Joi.string().required(),
        routePermitExpiryDate: express_validation_1.Joi.string().required(),
        taxTokenExpiryDate: express_validation_1.Joi.string().required(),
        fitnessCertificate: express_validation_1.Joi.string().required(),
        taxToken: express_validation_1.Joi.string().required(),
        routePermit: express_validation_1.Joi.string().required(),
        manufacturerCompany: express_validation_1.Joi.string().optional(),
        model: express_validation_1.Joi.string().optional(),
        chasisNo: express_validation_1.Joi.string().optional(),
        engineNo: express_validation_1.Joi.string().optional(),
        countryOfOrigin: express_validation_1.Joi.string().optional(),
        lcCode: express_validation_1.Joi.string().optional(),
        color: express_validation_1.Joi.string().optional(),
        deliveryToDipo: express_validation_1.Joi.string().optional(),
        deliveryDate: express_validation_1.Joi.string().optional(),
        orderDate: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyVehicle = (0, express_validation_1.validate)(vehicleValidation);
const vehicleUpdateValidation = {
    body: express_validation_1.Joi.object({
        registrationNo: express_validation_1.Joi.string().optional(),
        registrationFile: express_validation_1.Joi.string().optional(),
        fitnessCertificate: express_validation_1.Joi.string().optional(),
        taxToken: express_validation_1.Joi.string().optional(),
        routePermit: express_validation_1.Joi.string().optional(),
        manufacturerCompany: express_validation_1.Joi.string().optional(),
        registrationExpiryDate: express_validation_1.Joi.string().required(),
        fitnessExpiryDate: express_validation_1.Joi.string().required(),
        routePermitExpiryDate: express_validation_1.Joi.string().required(),
        taxTokenExpiryDate: express_validation_1.Joi.string().required(),
        model: express_validation_1.Joi.string().optional(),
        chasisNo: express_validation_1.Joi.string().optional(),
        engineNo: express_validation_1.Joi.string().optional(),
        countryOfOrigin: express_validation_1.Joi.string().optional(),
        lcCode: express_validation_1.Joi.string().optional(),
        color: express_validation_1.Joi.string().optional(),
        deliveryToDipo: express_validation_1.Joi.string().optional(),
        deliveryDate: express_validation_1.Joi.string().optional(),
        orderDate: express_validation_1.Joi.string().optional(),
        active: express_validation_1.Joi.boolean().optional(),
    })
};
exports.verifyVehicleUpdate = (0, express_validation_1.validate)(vehicleUpdateValidation);
