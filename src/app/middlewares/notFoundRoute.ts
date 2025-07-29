import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/SendResponse";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  SendResponse(res, {
    statusCode: 404,
    success: false,
    message: `${req.path} is not found`,
    error: "Path not found",
    data: null,
  });
};
