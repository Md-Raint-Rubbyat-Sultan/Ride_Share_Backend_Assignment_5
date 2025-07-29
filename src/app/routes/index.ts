import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
