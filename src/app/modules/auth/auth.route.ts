import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { credentialLoginZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(credentialLoginZodSchema),
  AuthControllers.credentialLogin
);

export const AuthRouter = router;
