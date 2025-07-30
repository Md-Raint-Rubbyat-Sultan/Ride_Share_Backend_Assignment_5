import dotenv from "dotenv";
dotenv.config();

interface IEnvVers {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  BCRYPT_SALT: string;
  JWT: {
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRESIN: string;
    JWT_REFRESH_EXPIRESIN: string;
  };
}

const EnvVarKeys: string[] = [
  "PORT",
  "DB_URI",
  "NODE_ENV",
  "EXPRESS_SESSION_SECRET",
  "FRONTEND_URL",
  "BCRYPT_SALT",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRESIN",
  "JWT_REFRESH_EXPIRESIN",
];

const loadEnvVars = (): IEnvVers => {
  EnvVarKeys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} is not found from .env file.`);
    }
  });

  return {
    PORT: (process.env.PORT as string) || "5000",
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    JWT: {
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
      JWT_ACCESS_EXPIRESIN: process.env.JWT_ACCESS_EXPIRESIN as string,
      JWT_REFRESH_EXPIRESIN: process.env.JWT_REFRESH_EXPIRESIN as string,
    },
  };
};

export const envVars = loadEnvVars();
