import { env } from '@config/environment';
import * as jwt from 'jsonwebtoken';


export const createTokenKeyPair = async (payload: any, publicKey: string, privateKey: string) => {
  const accessToken = await jwt.sign(payload, publicKey, {
    expiresIn: env.EXPIRESIN,
  });

  const refreshToken = await jwt.sign(payload, publicKey, {
    expiresIn: env.EXPIRESIN_REFRESH,
  });

  jwt.verify(accessToken, publicKey, (err: any, decode) => {
    if (err) {
      console.error('error verify: ', err);
    } else {
      console.log('decode verify: ', decode);
    }
  });

  return { accessToken, refreshToken };
};
