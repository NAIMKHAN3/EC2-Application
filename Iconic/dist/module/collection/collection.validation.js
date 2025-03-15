"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCollectionAuthorize = exports.verifyCollection = void 0;
const express_validation_1 = require("express-validation");
const collectionValidation = {
    body: express_validation_1.Joi.object({
        coachConfigId: express_validation_1.Joi.number().required(),
        counterId: express_validation_1.Joi.number().required(),
        supervisorId: express_validation_1.Joi.number().required(),
        collectionType: express_validation_1.Joi.string().required().valid("OthersIncome", "CounterCollection", "OpeningBalance"),
        routeDirection: express_validation_1.Joi.string().required().valid("Up_Way", "Down_Way"),
        noOfPassenger: express_validation_1.Joi.number().required(),
        token: express_validation_1.Joi.number().required(),
        amount: express_validation_1.Joi.number().required(),
        date: express_validation_1.Joi.string().required(),
        file: express_validation_1.Joi.string().optional(),
    })
};
exports.verifyCollection = (0, express_validation_1.validate)(collectionValidation);
const collectionAuthorizeValidation = {
    body: express_validation_1.Joi.object({
        edit: express_validation_1.Joi.boolean().required(),
        accounts: express_validation_1.Joi.array().optional().items(express_validation_1.Joi.object({
            accountId: express_validation_1.Joi.number().required(),
            amount: express_validation_1.Joi.number().required(),
        })),
    })
};
exports.verifyCollectionAuthorize = (0, express_validation_1.validate)(collectionAuthorizeValidation);
