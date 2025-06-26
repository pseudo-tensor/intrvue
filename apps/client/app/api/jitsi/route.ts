'use server'
import { userDetailsTsType } from '@repo/types/userTypes';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function createJitsiToken(user: userDetailsTsType) {
   try {
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      // avatar: "my avatar url",
      // appId: "my app id",
    }, 'myprivatekey');
    return NextResponse.json({ token: token }, {status: 200});
  } catch (err) {
    console.error("poor args or jwt issue");
    return NextResponse.json({}, {status: 400});
  }
}
