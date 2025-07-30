import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/SendResponse";
import passport from "passport";
import { AppError } from "../../errorHelpers/AppError";
import { createToken } from "../../utils/createUsreToken";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(new AppError(400, error));
      }

      if (!user) {
        return next(new AppError(404, error));
      }

      const userToken = createToken(user);

      const { password, ...rest } = user.toObject();

      SendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Logged in successfully.",
        data: { ...userToken, user: rest },
      });
    })(req, res, next);
  }
);

export const AuthControllers = {
  credentialLogin,
};
