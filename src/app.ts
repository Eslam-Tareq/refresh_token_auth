import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/error.middleWare";
import mountRoutes from "./routes";

const app = express();

const corsOptions = {
  origin: true,
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

mountRoutes(app);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `cant find ${req.url}`,
  });
});

app.use(globalErrorHandler);

export default app;
