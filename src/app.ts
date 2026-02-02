import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import shelfRoutes from "./routes/shelfRoutes.js";
import devAuth from "./routes/dev/devAuth.js";
import cookieParser from "cookie-parser";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// swagger setup
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec as any));
app.use("/docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

if (
  process.env.ENABLE_DEV_AUTH === "true" &&
  process.env.NODE_ENV !== "production"
) {
  app.use("/api/dev/auth", devAuth);
}

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/shelves", shelfRoutes);

app.use(errorHandler);

export default app;
