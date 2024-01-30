import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import NextAuth, { AuthOptions } from 'next-auth'; // prisma에서는 import NextAut from 'next-auth/next' 아님
//https://authjs.dev/reference/adapter/prisma?_gl=1*1jm324w*_gcl_au*MTMyMTEyNTUyNi4xNzA2MjQ5NzMwLjE2MjQ3MjQxMjEuMTcwNjI1MDQ0MC4xNzA2MjUxMDY0#setup

export const authOptions: AuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      GithubProvider({
         clientId: process.env.GITHUB_ID as string,
         clientSecret: process.env.GITHUB_SECRET as string,
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),

      Credentials({
         name: 'credentials',
         credentials: {
            email: { label: 'email', type: 'text' },
            password: { label: 'password', type: 'password' },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               throw new Error('Invalid credentials');
            }

            const user = await prisma.user.findUnique({
               where: {
                  email: credentials.email,
               },
            });

            if (!user || !user?.hashedPassword) {
               // 사용자가 존재하는데 hashedPassword 가 없을때
               throw new Error('Invalid credentials');
            }

            const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

            if (!isCorrectPassword) {
               throw new Error('Invalid credentials');
            }

            return user;
         },
      }),
   ],

   pages: {
      signIn: '/',
   },
   debug: process.env.NODE_ENV === 'development',
   session: {
      strategy: 'jwt',
   },

   secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
