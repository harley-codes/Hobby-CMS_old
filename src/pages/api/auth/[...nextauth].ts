import NextAuth, { AuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: AuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.NEXTAUTH_PROVIDER_GITHUB_ID!,
			clientSecret: process.env.NEXTAUTH_PROVIDER_GITHUB_SECRET!,
		})
	],
	secret: process.env.NEXTAUTH_SECRET,
	session:{
		strategy: 'jwt'
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
	},
	callbacks: {
		async signIn({ user, account, profile, email, credentials })
		{
			if (user.id !== process.env.NEXTAUTH_PROVIDER_GITHUB_ADMIN_USER_ID) return false
			return true
		},
	},
	debug: false,
}

export default NextAuth(authOptions)
