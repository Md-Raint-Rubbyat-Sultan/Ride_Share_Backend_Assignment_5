import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { RideRouter } from "../modules/ride/ride.route";
import { DriverRouter } from "../modules/driver/driver.route";
import { statsRouter } from "../modules/stats/stats.route";

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
  {
    path: "/driver",
    route: DriverRouter,
  },
  {
    path: "/stats",
    route: statsRouter,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
