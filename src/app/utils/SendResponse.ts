import { Response } from "express";
import { envVars } from "../configs/env.config";

export interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface TResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
  error?: any;
  stack?: string;
}

export const SendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data?.meta || null,
    errors:
      data?.error && envVars.NODE_ENV === "development"
        ? { error: data.error, errMessage: data.error.message }
        : data?.error?.massage || null,
    stack: envVars.NODE_ENV === "development" ? data?.stack : null,
  });
};
