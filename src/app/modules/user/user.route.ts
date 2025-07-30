import { Router } from "express";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { userControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/create",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsre
);

export const UserRoute = router;
