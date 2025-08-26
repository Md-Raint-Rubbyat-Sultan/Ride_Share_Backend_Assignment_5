import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statsServices } from "./stats.service";
import { SendResponse } from "../../utils/SendResponse";

const userStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.userStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User stats retrived",
      data: result.data,
    });
  }
);

const rideStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.rideStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User stats retrived",
      data: result.data,
    });
  }
);

export const statsControllers = {
  userStats,
  rideStats,
};
