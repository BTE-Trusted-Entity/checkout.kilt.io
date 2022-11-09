import { cwd } from 'node:process';
import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config();
const { env } = process;

const httpAuthPassword = env.SECRET_HTTP_AUTH_PASSWORD;

export const configuration = {
  baseUri: env.BASE_URI || 'http://localhost:3000',
  port: env.PORT || 3000,
  isProduction: env.NODE_ENV === 'production',
  distFolder: path.join(cwd(), 'dist', 'frontend'),
  httpAuthPassword,
};
