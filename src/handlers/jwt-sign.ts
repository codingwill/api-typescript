import IUser from "../interfaces/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

export default class JWTSign {
  public static async sign(
    user: IUser,
    callback: (err: Error | null, token: string | null) => void
  ) {
    const timeSinceEpoch = new Date().getTime();
    const expireTime =
      timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    const expireTimeInSeconds = Math.floor(expireTime / 1000);

    try {
      jwt.sign(
        {
          username: user.username,
        },
        config.server.token.secret,
        {
          issuer: config.server.token.issuer,
          algorithm: "HS256",
          expiresIn: expireTimeInSeconds,
        },
        (err, token) => {
          if (err) {
            callback(err, null);
          } else if (token) {
            callback(null, token);
          }
        }
      );
    } catch (err: any) {
      callback(err, null);
    }
  }
}
