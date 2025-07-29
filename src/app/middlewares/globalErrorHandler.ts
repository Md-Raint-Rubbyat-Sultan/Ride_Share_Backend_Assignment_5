import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/SendResponse";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = `something went wrong.`;

  SendResponse(res, {
    statusCode: status,
    success: false,
    message: message,
    data: null,
    error: error,
  });
};
