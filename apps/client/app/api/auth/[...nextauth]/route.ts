import axios from 'axios';
import NextAuth, { User, Session, DefaultSession, DefaultUser } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { userAuthTsType, userAuthZodType } from '@repo/types/userTypes';
import { authResponse } from '@repo/types/restEnums';
import { cookies } from "next/headers";
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import { signOut } from 'next-auth/react';

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add this line to allow id inside session.user
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Add this line to allow id inside the user object (for JWT)
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Add this to allow id inside the JWT
  }
}
axios.defaults.withCredentials = true;

const userSignInCredentials = {
  username: { label: "Username", type: "text", placeholder: "username" },
  password: { label: "Password", type: "password", placeholder: "password"}
}

const userSignUpCredentials = {
  username: { label: "Username", type: "text", placeholder: "username" },
  password: { label: "Password", type: "password", placeholder: "password"},
  name: { label: "Name", type: "text", placeholder: "name"},
  email: { label: "Email", type: "text", placeholder: "user@org.domain" }
}

const tokenSignInProvider = CredentialsProvider({
  id: "token-req",
  name: "Sign In Token",
  credentials: {},

  async authorize(credentials, req) {
    let user;
    user = await fetchUserId();
    if (user) {
      return {
        ...user.data,
        id: user.data.userId
      }
    }

    user = await refreshAccessToken();
    if (user) {
      return {
        ...user.data,
        id: user.data.userId
      }
    }
    return null;
  }
})


const signInProvider = CredentialsProvider({
  id: "sign-in-req",
  name: "Sign In Credentials",
  credentials: userSignInCredentials,

  async authorize(credentials, req) {
    const payload = userAuthZodType.safeParse({
      username: credentials?.username,
      password: credentials?.password
    });
    if (!payload.success) throw Error("invalid login details");

    const user = await fetchUserIdLegacy(payload.data);
    if (user.status != 200) {
      if (!user.data.enum) throw Error("Backend Issues");

      if (user.data.enum == authResponse.BAD_REQUEST) throw Error("Bad Request");

      if (user.data.enum == authResponse.USER_NOT_FOUND) {
        // go to signup page
        return null;
      }

      if (user.data.enum == authResponse.PASSWORD_INCORRECT) {
        // give warning for wrong password
        return null;
      }
    }

    const setCookieHeader = user.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieStore = await cookies()
      const cookieStrings = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]

      // Extract accessToken
      const accessTokenString = cookieStrings.find(str => str.startsWith('accessToken='))
      if (accessTokenString) {
        const match = accessTokenString.match(/accessToken=([^;]+)/)
        if (match && match[1]) {
          cookieStore.set('accessToken', match[1].trim(), {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'lax',
          })
        }
      }

      // Extract refreshToken
      const refreshTokenString = cookieStrings.find(str => str.startsWith('refreshToken='))
      if (refreshTokenString) {
        const match = refreshTokenString.match(/refreshToken=([^;]+)/)
        if (match && match[1]) {
          cookieStore.set('refreshToken', match[1].trim(), {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'lax',
          })
        }
      }
    }
    return {
      ...user.data,
      id: user.data.userId
    }
  }
})

const signUpProvider = CredentialsProvider({
  id: "sign-up-req",
  name: "Sign Up Credentials",
  credentials: userSignUpCredentials,

  async authorize(credentials, req) {
    const payload = userAuthZodType.safeParse({
      username: credentials?.username,
      password: credentials?.password,
      name: credentials?.name,
      email: credentials?.email
    });
    if (!payload.success) return null;
      const user = await createUser(payload.data);
      if (user.status != 200) return null; // add some better handling of reseieved enum cases here

      const setCookieHeader = user.headers['set-cookie'];
      if (setCookieHeader) {
        const cookieStore = await cookies()
        const cookieStrings = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]

        // Extract accessToken
        const accessTokenString = cookieStrings.find(str => str.startsWith('accessToken='))
        if (accessTokenString) {
          const match = accessTokenString.match(/accessToken=([^;]+)/)
          if (match && match[1]) {
            cookieStore.set('accessToken', match[1].trim(), {
              httpOnly: true,
              path: '/',
              maxAge: 60 * 60 * 24,
            })
          }
        }

        // Extract refreshToken
        const refreshTokenString = cookieStrings.find(str => str.startsWith('refreshToken='))
        if (refreshTokenString) {
          const match = refreshTokenString.match(/refreshToken=([^;]+)/)
          if (match && match[1]) {
            cookieStore.set('refreshToken', match[1].trim(), {
              httpOnly: true,
              path: '/',
              maxAge: 60 * 60 * 24,
            })
          }
        }
      }
      return {
        ...user.data,
        id: user.data.userId
      }
    }
})

const nextAuthOptions = {
  providers: [
    tokenSignInProvider,
    signInProvider,
    signUpProvider
  ],
  events: {
    signOut() {
      cookies().delete("accessToken");
      cookies().delete("refreshToken");
    }
  },
  callbacks: {
    jwt({ token, user }: {token: JWT, user: User | AdapterUser }) {
      if (user) {
        return { ...token, id: user.id }; // Save id to token as docs says: https://next-auth.js.org/configuration/callbacks
      }
      return token;
    },
    session: ({ session, token, user }: {session: Session, token: JWT, user: User | AdapterUser }) => {
      return {
        ...session,
        user: {
          ...session.user,
          // id: user.id, // This is copied from official docs which find user is undefined
          id: token.id, // Get id from token instead
        },
      };
    },
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    newUser: '/sign-up'
  }
}

const fetchUserId = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');
  const url = process.env.NEXTAUTH_BEURL?.concat("auth/signin/token");
  if (!url) throw Error("url not specified in .env");
  try {
    const requestResult = await axios.post(url, {}, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });
    return requestResult;
  } catch (err) {
    console.error("accessToken not valid");
    return null;
  }
}

const refreshAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');
  const url = process.env.NEXTAUTH_BEURL?.concat("auth/refresh");
  if (!url) throw Error("url not specified in .env");
  try {
    const requestResult = await axios.post(url, {}, {
      headers: {
        Cookie: `accessToken=${accessToken?.value}; refreshToken=${refreshToken?.value}`
      }
    });
    return requestResult;
  } catch (err) {
    console.error("refreshToken not valid");
    return null;
  }
}

const fetchUserIdLegacy = async (payload: userAuthTsType) => {
  const url = process.env.NEXTAUTH_BEURL?.concat("auth/signin/legacy");
  if (!url) throw Error("url not specified in .env");
  const requestResult = await axios.post(url, payload);
  return requestResult;
}

const createUser = async (payload: userAuthTsType) => {
  const url = process.env.NEXTAUTH_BEURL?.concat("auth/signup");
  if (!url) throw Error("url not specified in .env");
  const createResult = await axios.post(url, payload);
  return createResult;
}

const handler = NextAuth(nextAuthOptions);
export { handler as GET, handler as POST };
