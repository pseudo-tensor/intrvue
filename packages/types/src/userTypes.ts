import { z } from 'zod/v4';
import { TokenStatus, zAuthResponse, zTokenStatus } from './restEnums';

export const userAuthZodType = z.object({
  jwtToken: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional()
})

export type userAuthTsType = z.infer<typeof userAuthZodType>;

export const userDetailsZodType = z.object({
  id: z.string().uuid().optional(),
  enum: zAuthResponse.optional() || zTokenStatus.optional(),
  accessTokenStatus: zTokenStatus.optional(),
  refreshTokenStatus: zTokenStatus.optional(),
})


export type userDetailsTsType = z.infer<typeof userDetailsZodType>;

export const signinResponseZodType = z.object({
  id: z.string().uuid(),
})

export type signinResponseTsType = z.infer<typeof signinResponseZodType>;
