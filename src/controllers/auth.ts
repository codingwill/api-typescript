import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user";
import JWTSign from "../handlers/jwt-sign";
import logging from "../config/logging";

const NAMESPACE = "AuthController";

export default class AuthController {
  public static login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    User.find({ username })
      .exec()
      .then((users) => {
        if (users.length !== 1) {
          return res.status(404).json({
            message: "User Not Found",
          });
        }

        bcryptjs.compare(password, users[0].password, (err, result) => {
          if (err) {
            logging.error(NAMESPACE, err.message);

            return res.status(401).json({
              message: "Unauthorized",
            });
          } else if (result) {
            JWTSign.sign(users[0], (err, token) => {
              if (err) {
                logging.error(NAMESPACE, err.message);

                return res.status(401).json({
                  message: "Unauthorized",
                  err,
                });
              } else if (token) {
                return res.status(200).json({
                  message: "Successfully Logged In!",
                  token,
                  user: users[0].username,
                });
              }
            });
          }
        });
      })
      .catch((err) => {
        logging.error(NAMESPACE, err);
        return res.status(500).json({
          message: err.message,
          err,
        });
      });
  }

  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { username, password } = req.body;

    bcryptjs.hash(password, 12, (err, hashedPassword) => {
      if (err) {
        logging.error(NAMESPACE, err.message);

        return res.status(500).json({
          message: err.message,
          error: err,
        });
      }

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password: hashedPassword,
      });

      const savedUser = newUser
        .save()
        .then((user) => {
          return res.status(201).json({
            user,
          });
        })
        .catch((err) => {
          logging.error(NAMESPACE, err.message);

          return res.status(500).json({
            message: err.message,
            err,
          });
        });
    });
  }
}
