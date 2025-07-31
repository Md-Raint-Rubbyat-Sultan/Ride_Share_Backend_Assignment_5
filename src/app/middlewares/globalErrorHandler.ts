import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/SendResponse";
import { envVars } from "../configs/env.config";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(error);
  }
  let status = 500;
  let message = `something went wrong.`;

  SendResponse(res, {
    statusCode: status,
    success: false,
    message: message,
    data: error.message,
    stack: error.stack,
  });
};
