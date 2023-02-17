namespace NodeJS
{
	interface ProcessEnv
	{
		NEXT_PUBLIC_SITE_NAME: string
		NEXT_PUBLIC_DATE_FORMAT: string
		NEXT_PUBLIC_MAX_IMAGE_SIZE_UPLOAD_BYTES: number
		NEXT_PUBLIC_DEBUG_SHOW_IDS: boolean
		NEXTAUTH_URL: string
		NEXTAUTH_SECRET: string
		NEXTAUTH_PROVIDER_GITHUB_ADMIN_USER_ID: string
		NEXTAUTH_PROVIDER_GITHUB_ID: string
		NEXTAUTH_PROVIDER_GITHUB_SECRET: string
		DATABASE_TARGET_SERVICE: string
		DATABASE_PRISMA_COCKROACH_DATABASE_URL: string
	}
}
