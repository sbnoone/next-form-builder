import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcrypt'

import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	pages: { signIn: '/signin' },
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
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				})

				if (!user) {
					return null
				}

				const isValid = await bcrypt.compare(credentials.password, user.password)

				if (!isValid) {
					return null
				}

				const { password, ...rest } = user
				return rest
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
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
