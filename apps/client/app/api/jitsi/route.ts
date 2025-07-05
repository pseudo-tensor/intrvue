'use server';

import { userDetailsTsType } from '@repo/types/userTypes';
import jwt from 'jsonwebtoken';

export async function createJitsiToken(user: userDetailsTsType) {
  try {
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      // avatar: "my avatar url",
      // appId: "my app id",
    }, 'myprivatekey');

    return {
      success: true,
      token: token as string,
    };
  } catch (err) {
    console.error("poor args or jwt issue", err);
    return {
      success: false,
      error: "JWT generation failed",
    };
  }
}
