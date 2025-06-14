import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { userAuthTsType, userAuthZodType, userDetailsTsType } from '@repo/types/userTypes';

const userCredentials = {
  username: { label: "Username", type: "text", placeholder: "username" },
  password: { label: "Password", type: "password", placeholder: "password"}
}

const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: userCredentials,
  async authorize(credentials, req) {
    const payload = userAuthZodType.safeParse({
      username: credentials?.username,
      password: credentials?.password
    });
    if (payload.success) {
      const user = await fetchUserDetails(payload.data);
      return user;
    } else throw Error("invalid login details");
  }
})

const authOptions = {
  providers: [
    credentialsProvider
  ],
  pages: {
    signIn: '/sign-in',
    signOut: '/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    newUser: '/sign-up'
  }
}

const fetchUserDetails = async (payload: userAuthTsType): Promise<null | userDetailsTsType> => {
  const url = process.env.NEXTAUTH_BEURL?.concat("auth/signup");
  if (!url) throw Error("url not specified in .env");
  console.log(url);
  const requestResult = await axios.post(url, payload);
  if (requestResult.status == 200) return requestResult.data;
  else if (requestResult.status == 204) return null;
  else throw Error("Internal Server Error");
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};
