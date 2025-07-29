import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { notFound } from "./app/middlewares/notFoundRoute";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to Ride App.");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
