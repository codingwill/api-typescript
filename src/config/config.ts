import dotenv from "dotenv";

dotenv.config();

const ONE_HOUR_IN_SECONDS = 3600;

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 8080;

/** JWT */
const JWT_TOKEN_EXPIRE_TIME =
  process.env.JWT_TOKEN_EXPIRE_TIME || ONE_HOUR_IN_SECONDS;
const JWT_TOKEN_ISSUER = process.env.JWT_TOKEN_ISSUER || "will";
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "secrettoken";

const SERVER = {
  hostname: HOSTNAME,
  port: PORT,
  token: {
    expireTime: JWT_TOKEN_EXPIRE_TIME,
    issuer: JWT_TOKEN_ISSUER,
    secret: JWT_TOKEN_SECRET,
  },
};

/** DATABASE */
const DB_USERNAME = process.env.DB_USERNAME || "will";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 27017;

const DB = {
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  username: DB_USERNAME,
  url: `mongodb://${DB_HOST}:${DB_PORT}`,
};

/** EXTERNALS */
const GET_JOBS =
  "http://dev3.dansmultipro.co.id/api/recruitment/positions.json";
const GET_JOB_DETAIL =
  "http://dev3.dansmultipro.co.id/api/recruitment/positions";

const API = {
  externals: {
    job_list: GET_JOBS,
    job_detail: GET_JOB_DETAIL,
  },
};

const config = {
  api: API,
  db: DB,
  server: SERVER,
};

export default config;
