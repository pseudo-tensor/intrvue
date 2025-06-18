import config from '../config';
import { TokenStatus } from '@repo/types/restEnums';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from "express";

export const checkAccessToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  let accessTokenStatus: TokenStatus = TokenStatus.ACCESS_TOKEN_VALID;
  let refreshTokenStatus: TokenStatus = TokenStatus.REFRESH_TOKEN_VALID;

  if (!('accessToken' in req.cookies)) {
    accessTokenStatus = TokenStatus.ACCESS_TOKEN_MISSING;
  }
  if (!config.jwtSecret) throw Error("JWT Secret missing");
  try {
    jwt.verify(
      req.cookies['accessToken'],
      config.jwtSecret,
      config.signAlgo,
    );
  } catch(err) {
    if (err) {
      if (err instanceof TokenExpiredError) accessTokenStatus = TokenStatus.ACCESS_TOKEN_EXPIRED;
      else accessTokenStatus = TokenStatus.ACCESS_TOKEN_INVALID;
    }
  }

  if (accessTokenStatus == TokenStatus.ACCESS_TOKEN_VALID) {
    next();
    return;
  } else {
    res.status(401).json({
      enum: refreshTokenStatus
    })
    return;
  }
}

export const checkRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  let refreshTokenStatus: TokenStatus = TokenStatus.REFRESH_TOKEN_VALID;
  if (!('refreshToken' in req.cookies)) {
    refreshTokenStatus = TokenStatus.REFRESH_TOKEN_MISSING;
  }

  if (!config.jwtSecret) throw Error("JWT Secret missing");

  try {
    jwt.verify(
      req.cookies['refreshToken'],
      config.jwtSecret,
      config.signAlgo,
    );
  } catch(err) {
    if (err) {
      if (err instanceof TokenExpiredError) refreshTokenStatus = TokenStatus.REFRESH_TOKEN_EXPIRED;
      else refreshTokenStatus = TokenStatus.REFRESH_TOKEN_INVALID;
    }
  }

  if (refreshTokenStatus == TokenStatus.REFRESH_TOKEN_VALID) {
    next();
    return;
  }

  res.status(401).json({
    enum: TokenStatus.UNAUTHORIZED,
    refreshTokenStatus: refreshTokenStatus
  })
  return;
}
