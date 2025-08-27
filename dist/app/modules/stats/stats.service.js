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
exports.statsServices = void 0;
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
const userStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalUserInLastSevenDaysPromise = user_model_1.User.countDocuments({
        createdAt: sevenDaysAgo,
    });
    const totlaUserInLastThirtyDaysPromise = user_model_1.User.countDocuments({
        createdAt: thirtyDaysAgo,
    });
    const totalUserAccordingTheirRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                total: { $sum: 1 },
            },
        },
        {
            $project: {
                role: "$_id",
                total: 1,
                _id: 0,
            },
        },
    ]);
    const [totalUsers, totalUserInLastSevenDays, totlaUserInLastThirtyDays, totalUserAccordingTheirRole,] = yield Promise.all([
        totalUsersPromise,
        totalUserInLastSevenDaysPromise,
        totlaUserInLastThirtyDaysPromise,
        totalUserAccordingTheirRolePromise,
    ]);
    return {
        data: {
            totalUsers,
            totalUserInLastSevenDays,
            totlaUserInLastThirtyDays,
            totalUserAccordingTheirRole,
        },
    };
});
const rideStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalRidePromise = ride_model_1.Ride.countDocuments();
    const totalRideInLastSevenDaysPromise = ride_model_1.Ride.countDocuments({
        createdAt: sevenDaysAgo,
    });
    const totalRideInLastThirtyDaysPromise = ride_model_1.Ride.countDocuments({
        createdAt: thirtyDaysAgo,
    });
    const totalCancelledRidePromise = ride_model_1.Ride.countDocuments({
        rideStatus: ride_interface_1.RideStatus.CANCELED,
    });
    const totalCompletedRidePromise = ride_model_1.Ride.countDocuments({
        rideStatus: ride_interface_1.RideStatus.COMPLETED,
    });
    const totalPaymentPromise = ride_model_1.Ride.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$costOfRide" },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    const totalRideCancledByRiderPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                driverId: null,
                rideStatus: ride_interface_1.RideStatus.CANCELED,
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    const totalRideCancledByDriverPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                driverId: { $ne: null },
                rideStatus: ride_interface_1.RideStatus.CANCELED,
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    const driversCanceledTheRidePromise = ride_model_1.Ride.find({
        driverId: { $ne: null },
        rideStatus: ride_interface_1.RideStatus.CANCELED,
    }).populate("driverId", "-password");
    const [totalRide, totalRideInLastSevenDays, totalRideInLastThirtyDays, totalCancelledRide, totalCompletedRide, totalPayment, totalRideCancledByRider, totalRideCancledByDriver, driversCanceledTheRide,] = yield Promise.all([
        totalRidePromise,
        totalRideInLastSevenDaysPromise,
        totalRideInLastThirtyDaysPromise,
        totalCancelledRidePromise,
        totalCompletedRidePromise,
        totalPaymentPromise,
        totalRideCancledByRiderPromise,
        totalRideCancledByDriverPromise,
        driversCanceledTheRidePromise,
    ]);
    return {
        data: {
            totalRide,
            totalRideInLastSevenDays,
            totalRideInLastThirtyDays,
            totalCancelledRide,
            totalCompletedRide,
            totalPayment,
            totalRideCancledByRider,
            totalRideCancledByDriver,
            driversCanceledTheRide,
        },
    };
});
exports.statsServices = { userStats, rideStats };
