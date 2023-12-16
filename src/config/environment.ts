import 'dotenv/config';
import { cleanEnv, str } from 'envalid';
interface EnvType {
  MONGODB_URI: string;
  DATABASE_NAME: string;
  APP_HOST: string;
  APP_PORT: string;

  SECRETKEY: string;
  EXPIRESIN: string;
  SECRETKEY_REFRESH: string;
  EXPIRESIN_REFRESH: string;
}

export const env: EnvType = cleanEnv(process.env, {
  MONGODB_URI: str(),
  DATABASE_NAME: str(),
  APP_HOST: str(),
  APP_PORT: str(),
  SECRETKEY: str(),
  EXPIRESIN: str(),
  SECRETKEY_REFRESH: str(),
  EXPIRESIN_REFRESH: str(),
});
