import { JwtService } from '@nestjs/jwt';
import { env } from '@config/environment';

export const createTokenKeyPair = async (
  payload: any,
  jwtService: JwtService,
  publicKey: string,
  privateKey: string,
) => {
  const accessToken = jwtService.sign(payload, {
    expiresIn: env.EXPIRESIN,
    privateKey,
  });
  const refreshToken = jwtService.sign(payload, {
    secret: env.SECRETKEY_REFRESH,
    expiresIn: env.EXPIRESIN_REFRESH,
    privateKey,
  });

  try {
    const decodedAccessToken = jwtService.verify(accessToken, { publicKey });
    console.log('decode verify: ', decodedAccessToken);
  } catch (err) {
    console.error('error verify: ', err);
  }

  return { accessToken, refreshToken };
};
