import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default class AuthChecker {
  public static async verifyJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      jwt.verify(token, config.server.token.secret, (err, decodedToken) => {
        if (err) {
          return res.status(404).json({
            message: err.message,
            error: err,
          });
        } else {
          res.locals.jwt = decodedToken;
          next();
        }
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
}
