import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';

dotenv.config();

const config = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  accTokenExp: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
  refTokenExp: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  signAlgo: { algorithms: [process.env.JWT_ALGORITHM? process.env.JWT_ALGORITHM as Algorithm : 'HS256'] }
};

export default config;
