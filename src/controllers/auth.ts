import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user";
import JWTSign from "../handlers/jwt-sign";
import logging from "../config/logging";
import DataReturnHelper from "../helpers/data-return";

const NAMESPACE = "AuthController";

export default class AuthController {
  public static login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    User.find({ username })
      .exec()
      .then((users) => {
        if (users.length !== 1) {
          return res
            .status(404)
            .json(new DataReturnHelper(false, "User Not Found"));
        }

        bcryptjs.compare(password, users[0].password, (err, result) => {
          if (err) {
            logging.error(NAMESPACE, err.message);

            return res
              .status(401)
              .json(new DataReturnHelper(false, "Unauthorized", err));
          } else if (result) {
            JWTSign.sign(users[0], (err, token) => {
              if (err) {
                logging.error(NAMESPACE, err.message);

                return res
                  .status(401)
                  .json(new DataReturnHelper(false, "Unauthorized", err));
              } else if (token) {
                const data = {
                  username: users[0].username,
                  token: token,
                };
                return res
                  .status(200)
                  .json(
                    new DataReturnHelper(true, "Successfully Logged In", data)
                  );
              }
            });
          }
        });
      })
      .catch((err) => {
        logging.error(NAMESPACE, err);
        return res
          .status(500)
          .json(new DataReturnHelper(false, err.message, err));
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

        return res
          .status(500)
          .json(new DataReturnHelper(false, err.message, err));
      }

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        password: hashedPassword,
      });

      const savedUser = newUser
        .save()
        .then((user) => {
          const data = {
            id: user.id,
            username: user.username,
          };
          return res
            .status(201)
            .json(
              new DataReturnHelper(
                true,
                "Successfully Registered New User",
                data
              )
            );
        })
        .catch((err) => {
          logging.error(NAMESPACE, err.message);

          return res
            .status(500)
            .json(new DataReturnHelper(false, err.message, err));
        });
    });
  }
}
