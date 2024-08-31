import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import credentials from "next-auth/providers/credentials";
import { Db } from "@/utils/database";

const handler = NextAuth({
    session: {
      strategy: 'jwt',
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      credentials({
        name: 'credentials',
        credentials: {
          email: { label: 'email', type: 'text', placeholder: '이메일을 입력해주세요.' },
          password: { label: 'password', type: 'password', placeholder: '비밀번호를 입력해주세요.' },
        },
        async authorize(credentials) {
          const db = await Db.connect()

          const user = await db.collection('users').findOne({
            email: credentials!.email,
          });
  
          return { id: user!.id };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (account?.provider === 'google') {
            const db = await Db.connect()
  
          const user = await db.collection('users').findOne({
            email: token.email,
          });
  
          if (!user) {
            throw new Error('함께하고 있는 계정이 아니에요:(');
          }
        }
        return token;
      },
      session({ session }) {
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login',
    },
  });

export { handler as GET, handler as POST };
