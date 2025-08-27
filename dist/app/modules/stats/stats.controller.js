"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const stats_service_1 = require("./stats.service");
const SendResponse_1 = require("../../utils/SendResponse");
const userStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield stats_service_1.statsServices.userStats();
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats retrived",
        data: result.data,
    });
}));
const rideStats = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield stats_service_1.statsServices.rideStats();
    (0, SendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats retrived",
        data: result.data,
    });
}));
exports.statsControllers = {
    userStats,
    rideStats,
};
