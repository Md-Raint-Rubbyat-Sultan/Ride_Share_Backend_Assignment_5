import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: ZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    req.body = await zodSchema.parseAsync(req.body);
    next();
  });
