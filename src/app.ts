/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";
const app: Application = express();
import cron from "node-cron";
import { distributeMonthlyProfit } from "./app/modules/userProfit/profit.distribution";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger.json";
//persers
app.use(express.json());
app.use(cookieParser());

const determineOrigin = (requestOrigin: any) => {
  if (requestOrigin === "http://localhost:3000") {
    return "http://localhost:3000";
  } else if (requestOrigin === "https://trx-gold-client-cxtu.vercel.app") {
    return "https://trx-gold-client-cxtu.vercel.app";
  } else {
    return false;
  }
};

// Middleware configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = determineOrigin(origin);
      callback(null, allowedOrigin);
    },
    credentials: true,
  })
);

app.use("/api/v1", router);

app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get("/", (req: Request, res: Response) => {
  res.json({
    projectName: "Trx Gold Server Is Running (Istiak Ahmed Shawon)!!",
    portNumber: `running the port number ${config.port}`,
  });
});

cron.schedule("*/1 * * * *", distributeMonthlyProfit);

//global-error
app.use(globalErrorHandler);
//api not found
app.use(notFound);
export default app;
