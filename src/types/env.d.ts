namespace NodeJS
{
	interface ProcessEnv
	{
		NEXT_PUBLIC_SITE_NAME: string
		NEXTAUTH_URL: string
		NEXTAUTH_SECRET: string
		NEXTAUTH_PROVIDER_GITHUB_ADMIN_USER_ID: string
		NEXTAUTH_PROVIDER_GITHUB_ID: string
		NEXTAUTH_PROVIDER_GITHUB_SECRET: string
		DATABASE_TARGET_SERVICE: string
		DATABASE_PRISMA_COCKROACH_DATABASE_URL: string
	}
}