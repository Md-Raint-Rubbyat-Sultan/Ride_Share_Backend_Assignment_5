import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
