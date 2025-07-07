import { z } from 'zod/v4';
import { zSessionModifiers } from './restEnums';

export const userAuthZodType = z.object({
  jwtToken: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional()
})

export type userAuthTsType = z.infer<typeof userAuthZodType>;

export const userDetailsZodType = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
})

export type userDetailsTsType = z.infer<typeof userDetailsZodType>;

export const signinResponseZodType = z.object({
  id: z.string().uuid(),
})

export type signinResponseTsType = z.infer<typeof signinResponseZodType>;


export const createSessionZodType = z.object({
  id: z.string().uuid(),
  pUsername: z.string().optional(),
  date: z.union([
    z.string().datetime(),         // allow ISO string
    z.date()
  ]).optional().transform((val) => typeof val === 'string' ? new Date(val) : val)
});


export type createSessionTsType = z.infer<typeof createSessionZodType>;

export const fetchInterviewDetailsZodType = z.object({
  id: z.string().uuid(),
  enum: zSessionModifiers,
  modificationPayload: createSessionZodType
})

export type fetchInterviewDetailsZodType = z.infer<typeof fetchInterviewDetailsZodType>;

export const sessionDataZodType = z.object({
  session_id: z.string(),
  host_id: z.string().uuid(),
  participant_id: z.string().uuid().optional(),
  status: z.string(),
  date: z.date().optional(),
  code_data: z.string(),
  text_data: z.json()
})

export type sessionDataTsType = z.infer<typeof sessionDataZodType>;

