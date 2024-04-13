import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Api } from "@src/utils/Api";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const resBody = await res.json();
        if (res.status !== 200) {
          throw new Error(resBody.error);
        } else {
          return resBody.user;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      httpOptions: {
        timeout: 5000,
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }: { account: any; user: any }) {
      if (account.provider === "google") {
        const res = await Api.handleOauth(
          user.email,
          account.provider,
          user.name
        );

        if (res.status !== 200) {
          throw new Error((await res.json()).message);
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user: any;
      account: any;
    }) {
      if (account && user) {
        if (account.provider === "credentials") {
          // return id directly from user object
          return {
            ...token,
            id: user.id,
            name: user.username.username,
          };
        }
        // for OAuth, we must get our own ID by calling the database
        return {
          ...token,
          id: await Api.getId(token.email, account.provider, user.name),
          name: user.name,
        };
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // attach the id onto the session
      return {
        user: { ...session.user, id: token.id, name: token.name },
        expires: session.expires,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
