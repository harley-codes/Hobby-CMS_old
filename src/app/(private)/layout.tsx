import { LayoutBody } from '@/app/(private)/layout.body'
import { LayoutNav } from '@/app/(private)/layout.nav'
import { AuthContextRequireAuth, CssBaselineWrapper, SessionProviderWrapper } from '@/components'
import { Roboto } from '@next/font/google'
import { getServerSession } from 'next-auth/next'

const robotoFont = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

export default async function RootLayout({ children }: Children)
{
	const session = await getServerSession()

	return (
		<html lang="en" className={robotoFont.className}>
			<head />
			<body>
				<CssBaselineWrapper />
				<SessionProviderWrapper session={session}>
					<AuthContextRequireAuth>
						<LayoutNav />
						<LayoutBody>{children}</LayoutBody>
					</AuthContextRequireAuth>
				</SessionProviderWrapper>
			</body>
		</html>
	)
}
