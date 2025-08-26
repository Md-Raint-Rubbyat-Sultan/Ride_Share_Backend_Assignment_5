import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));

const userStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalUserInLastSevenDaysPromise = User.countDocuments({
    createdAt: sevenDaysAgo,
  });
  const totlaUserInLastThirtyDaysPromise = User.countDocuments({
    createdAt: thirtyDaysAgo,
  });

  const totalUserAccordingTheirRolePromise = User.aggregate([
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

  const [
    totalUsers,
    totalUserInLastSevenDays,
    totlaUserInLastThirtyDays,
    totalUserAccordingTheirRole,
  ] = await Promise.all([
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
};

const rideStats = async () => {
  const totalRidePromise = Ride.countDocuments();
  const totalRideInLastSevenDaysPromise = Ride.countDocuments({
    createdAt: sevenDaysAgo,
  });
  const totalRideInLastThirtyDaysPromise = Ride.countDocuments({
    createdAt: thirtyDaysAgo,
  });
  const totalCancelledRidePromise = Ride.countDocuments({
    rideStatus: RideStatus.CANCELED,
  });
  const totalCompletedRidePromise = Ride.countDocuments({
    rideStatus: RideStatus.COMPLETED,
  });
  const totalPaymentPromise = Ride.aggregate([
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
  const totalRideCancledByRiderPromise = Ride.aggregate([
    {
      $match: {
        driverId: null,
        rideStatus: RideStatus.CANCELED,
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
  const totalRideCancledByDriverPromise = Ride.aggregate([
    {
      $match: {
        driverId: { $ne: null },
        rideStatus: RideStatus.CANCELED,
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
  const driversCanceledTheRidePromise = Ride.find({
    driverId: { $ne: null },
    rideStatus: RideStatus.CANCELED,
  }).populate("driverId", "-password");

  const [
    totalRide,
    totalRideInLastSevenDays,
    totalRideInLastThirtyDays,
    totalCancelledRide,
    totalCompletedRide,
    totalPayment,
    totalRideCancledByRider,
    totalRideCancledByDriver,
    driversCanceledTheRide,
  ] = await Promise.all([
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
};

export const statsServices = { userStats, rideStats };
