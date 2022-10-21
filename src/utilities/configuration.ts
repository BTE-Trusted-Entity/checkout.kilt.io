import dotenv from "dotenv";

dotenv.config();
const { env } = process;

export const configuration = {
  baseUri: env.BASE_URI || "http://localhost:3000",
  port: env.PORT || 3000,
  isProduction: env.NODE_ENV === "production",
};
