'use server';

import axios from 'axios';
import { userDetailsTsType } from '@repo/types/userTypes';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function createJitsiToken(user: userDetailsTsType) {
  const base = (process.env.NEXTAUTH_BEURL ?? "http://localhost:8080/api/v1/");
  const url = base.concat("interview/jitsi/token");
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const refreshToken = cookieStore.get('refreshToken');
    const result: {token: string} = await axios.post(url, payload, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });

    if (!result.token) {
      return {
        success: false,
        error: "JWT generation failed",
      }
    }

    return {
      success: true,
      token: result.token,
    };
  } catch (err) {
    console.error("poor args or jwt issue", err);
    return {
      success: false,
      error: "JWT generation failed",
    };
  }
}
