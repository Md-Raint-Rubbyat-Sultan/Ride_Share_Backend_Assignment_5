import { Response } from "express";
import { envVars } from "../configs/env.config";

interface TMeta {
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
  });
};
