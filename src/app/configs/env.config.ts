import dotenv from "dotenv";
dotenv.config();

interface IEnvVers {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
}

const EnvVarKeys: string[] = ["PORT", "DB_URI", "NODE_ENV"];

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
  };
};

export const envVars = loadEnvVars();
