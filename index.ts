import { Request, Response, Express, NextFunction } from "express";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import config from "./src/config/config";
import http from "http";
import bodyParser from "body-parser";
import logging from "./src/config/logging";
import authRoutes from "./src/routes/unprotected/auth";
import jobsRoutes from "./src/routes/protected/jobs";

dotenv.config();

const NAMESPACE = "Main";

const app: Express = express();

/** CONNECT DB */
mongoose
  .connect(config.db.url)
  .then((result) => {
    logging.info(NAMESPACE, `DB is running. Info: ${result}`);
  })
  .catch((err) => {
    logging.info(NAMESPACE, err.message);
  });

/** LOGGER */
app.use((req: Request, res: Response, next: NextFunction) => {
  /** LOG REQUEST */
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  /** LOG RESPONSE */
  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

/** BODY PARSER */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** RULES */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

/** ROUTES */
app.use("/auth", authRoutes);
app.use("/jobs", jobsRoutes);

const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `Server is running on ${config.server.hostname}:${config.server.port}`
  )
);
