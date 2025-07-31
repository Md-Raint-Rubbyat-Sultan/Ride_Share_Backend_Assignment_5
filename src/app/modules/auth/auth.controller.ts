import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { envVars } from "../../configs/env.config";
import { AppError } from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { createToken } from "../../utils/createUsreToken";
import { SendResponse } from "../../utils/SendResponse";
import { steCookies, TAuthToken } from "../../utils/setCookies";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";

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

      steCookies(res, userToken);

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

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body.password as string;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.setPassword(decodedToken.userId, payload);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "password set successfully.",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "password change successfully.",
      data: null,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refereshToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "lax",
    });
    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "logout successfully.",
      data: null,
    });
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
  setPassword,
  changePassword,
  logout,
};
