"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steCookies = void 0;
const steCookies = (res, { accessToken, refreshToken }) => {
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
exports.steCookies = steCookies;
