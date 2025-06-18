import jwt from 'jsonwebtoken';
import config from '../config';

export const createAccessToken = (userId: string): string | null => {
  if (!config.jwtSecret) return null

  let newAccessToken: string;
  try {
    newAccessToken = jwt.sign(
      { userId: userId },
      config.jwtSecret,
      {
        algorithm: config.signAlgo.algorithms[0],
        expiresIn: '24h'
      }
    );
  } catch(err) {
    console.error("Error while creating new access token");
    return null;
  }

  return newAccessToken;
}

export const createRefreshToken = (userId: string) => {
  if (!config.jwtSecret) return null

  let newRefreshToken: string;
  try {
    newRefreshToken = jwt.sign(
      { userId: userId },
      config.jwtSecret,
      {
        algorithm: config.signAlgo.algorithms[0],
        expiresIn: '30d'
      }
    );
  } catch(err) {
    console.error("Error while creating new refresh token");
    return null;
  }

  return newRefreshToken;
}

