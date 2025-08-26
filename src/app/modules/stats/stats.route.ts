import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsControllers } from "./stats.controller";

const router = Router();

router.get("/user-stats", checkAuth(Role.ADMIN), statsControllers.userStats);

router.get("/ride-stats", checkAuth(Role.ADMIN), statsControllers.rideStats);

export const statsRouter = router;
