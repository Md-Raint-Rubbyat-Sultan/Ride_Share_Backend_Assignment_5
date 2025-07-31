import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { RideRouter } from "../modules/ride/ride.route";

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
  {
    path: "/ride",
    route: RideRouter,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
