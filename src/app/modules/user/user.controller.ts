import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { SendResponse } from "../../utils/SendResponse";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createUser(req.body);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully.",
      data: result.data,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllUser(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User retrived successfully.",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUser,
};
