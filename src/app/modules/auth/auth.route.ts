import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { credentialLoginZodSchema } from "./auth.validation";
import passport from "passport";
import { envVars } from "../../configs/env.config";

const router = Router();

router.post(
  "/login",
  validateRequest(credentialLoginZodSchema),
  AuthControllers.credentialLogin
);

// google-passport
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query?.redirect;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=Something went wrong. Please contact to our team.`,
  }),
  AuthControllers.googleCallback
);

export const AuthRouter = router;
