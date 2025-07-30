import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { envVars } from "../../configs/env.config";
import { AppError } from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { createToken } from "../../utils/createUsreToken";
import { SendResponse } from "../../utils/SendResponse";
import { steCookies } from "../../utils/setCookies";

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

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    let redirect = (req.query.state as string) || "/";

    if (redirect.startsWith("/")) {
      redirect = redirect.slice(1);
    }

    const userToken = createToken(user);

    steCookies(res, userToken);

    res.redirect(`${envVars.FRONTEND_URL}/${redirect}`);
  }
);

export const AuthControllers = {
  credentialLogin,
  googleCallback,
};
