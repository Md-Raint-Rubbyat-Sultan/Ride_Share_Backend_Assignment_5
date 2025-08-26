import { Response } from "express";

export interface TAuthToken {
  accessToken?: string;
  refreshToken?: string;
}

export const steCookies = (
  res: Response,
  { accessToken, refreshToken }: TAuthToken
) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (refreshToken) {
    res.cookie("refereshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
