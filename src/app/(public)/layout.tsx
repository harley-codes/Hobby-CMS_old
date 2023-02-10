import { SessionProviderWrapper } from '@/components'
import { getServerSession } from 'next-auth/next'

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode,
})
{
	const session = await getServerSession()

	return (
		<html lang="en">
			<head />
			<body>
				<SessionProviderWrapper session={session}>
					{children}
				</SessionProviderWrapper>
			</body>
		</html>
	)
}
