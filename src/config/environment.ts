import 'dotenv/config';

export const env:any = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  SECRETKEY: process.env.SECRETKEY,
  EXPIRESIN: process.env.EXPIRESIN,
  SECRETKEY_REFRESH: process.env.SECRETKEY_REFRESH,
  EXPIRESIN_REFRESH: process.env.EXPIRESIN_REFRESH,
};
