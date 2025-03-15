"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCancelBooking = exports.verifyBookingSeat = exports.verifyCheckSeatAvailability = exports.verifyOrderCancel = exports.verifyOrderUpdate = exports.verifyOrder = void 0;
const express_validation_1 = require("express-validation");
const orderValidation = {
    body: express_validation_1.Joi.object({
        counterId: express_validation_1.Joi.number().optional(),
        customerName: express_validation_1.Joi.string().optional().allow(' '),
        orderType: express_validation_1.Joi.string().optional().valid("One_Trip", "Round_Trip"),
        phone: express_validation_1.Joi.string().optional().allow(' '),
        email: express_validation_1.Joi.string().optional().allow(' '),
        address: express_validation_1.Joi.string().optional().allow(' '),
        age: express_validation_1.Joi.string().optional().allow(' '),
        gender: express_validation_1.Joi.string().optional().valid("Male", "Female"),
        nid: express_validation_1.Joi.string().optional().allow(' '),
        nationality: express_validation_1.Joi.string().optional().allow(' '),
        paymentMethod: express_validation_1.Joi.string().required().allow(' '),
        paymentType: express_validation_1.Joi.string().required().valid("FULL", "PARTIAL"),
        bookingType: express_validation_1.Joi.string().required().valid("SeatIssue", "SeatBooking"),
        expiryBookingDate: express_validation_1.Joi.string().optional(),
        expiryBookingTime: express_validation_1.Joi.string().optional(),
        boardingPoint: express_validation_1.Joi.string().required().allow(' '),
        droppingPoint: express_validation_1.Joi.string().required().allow(' '),
        returnBoardingPoint: express_validation_1.Joi.string().optional().allow(' '),
        returnDroppingPoint: express_validation_1.Joi.string().optional().allow(' '),
        noOfSeat: express_validation_1.Joi.number().required(),
        amount: express_validation_1.Joi.number().required(),
        paymentAmount: express_validation_1.Joi.number().optional(),
        date: express_validation_1.Joi.string().required(), // date format Ex: yyyy-MM-dd
        returnDate: express_validation_1.Joi.string().optional(), // date format Ex: yyyy-MM-dd
        seats: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
            seat: express_validation_1.Joi.string().required(),
            coachConfigId: express_validation_1.Joi.number().required(),
            schedule: express_validation_1.Joi.string().required(),
            date: express_validation_1.Joi.string().required(),
        }).required()).required(),
    })
};
exports.verifyOrder = (0, express_validation_1.validate)(orderValidation);
const orderUpdateValidation = {
    body: express_validation_1.Joi.object({
        customerName: express_validation_1.Joi.string().optional().allow(' '),
        phone: express_validation_1.Joi.string().optional().allow(' '),
    })
};
exports.verifyOrderUpdate = (0, express_validation_1.validate)(orderUpdateValidation);
const orderCancelValidation = {
    body: express_validation_1.Joi.object({
        cancelNote: express_validation_1.Joi.string().required(),
        refundPercentage: express_validation_1.Joi.number().required(),
        refundType: express_validation_1.Joi.string().required().valid("NO_Charge", "No_Cancellation", "%_Of_Ticket_Fare")
    })
};
exports.verifyOrderCancel = (0, express_validation_1.validate)(orderCancelValidation);
const checkSeatAvailabilityValidation = {
    body: express_validation_1.Joi.object({
        coachConfigId: express_validation_1.Joi.number().required(),
        date: express_validation_1.Joi.string().required(), // date format Ex: yyyy-MM-dd
        schedule: express_validation_1.Joi.string().required(),
        seats: express_validation_1.Joi.array().items(express_validation_1.Joi.string().required()).required(),
    })
};
exports.verifyCheckSeatAvailability = (0, express_validation_1.validate)(checkSeatAvailabilityValidation);
const bookingSeat = {
    body: express_validation_1.Joi.object({
        coachConfigId: express_validation_1.Joi.number().required(),
        date: express_validation_1.Joi.string().required(), // date format Ex: yyyy-MM-dd
        schedule: express_validation_1.Joi.string().required(),
        seat: express_validation_1.Joi.string().required(),
    })
};
exports.verifyBookingSeat = (0, express_validation_1.validate)(bookingSeat);
const cancelBooking = {
    body: express_validation_1.Joi.object({
        seats: express_validation_1.Joi.array().items(express_validation_1.Joi.object({
            seat: express_validation_1.Joi.string().required(),
            coachConfigId: express_validation_1.Joi.number().required(),
            schedule: express_validation_1.Joi.string().required(),
            date: express_validation_1.Joi.string().required(),
        }).required()).required(),
    })
};
exports.verifyCancelBooking = (0, express_validation_1.validate)(cancelBooking);
