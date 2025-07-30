import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { SendResponse } from "../../utils/SendResponse";
import { JwtPayload } from "jsonwebtoken";

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

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const result = await UserServices.getSingleUser(_id);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User retrived successfully.",
      data: result.data,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const result = await UserServices.getMe(user.userId);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User retrived successfully.",
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.updateUser(userId, payload, decodedToken);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User retrived successfully.",
      data: result.data,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUser,
  getSingleUser,
  getMe,
  updateUser,
};
