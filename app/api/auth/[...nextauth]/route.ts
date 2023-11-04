import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { prisma } from '@/lib/prisma'

/* 
  Add signup page
  Create new user with form, Save in db
  Login registered users with credentials
*/

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				console.log(credentials)
				// Add logic here to look up the user from the credentials supplied
				const user = { id: '1', name: 'Slava Baklanov', email: 'a@a.ua', image: '' }

				if (user) {
					// Any object returned will be saved in `user` property of the JWT
					return user
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null
					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub
			}
			return session
		},
	},
	pages: { signIn: '/signin' },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
