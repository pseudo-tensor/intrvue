import { z } from 'zod';

export const userAuthZodType = z.object({
  username: z.string(),
  password: z.string()
})

export type userAuthTsType = z.infer<typeof userAuthZodType>;

export const userDetailsZodType = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email()
})

export type userDetailsTsType = z.infer<typeof userDetailsZodType>;
