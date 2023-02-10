'use client'

import styles from './page.module.scss'

import { GitHub as GitHubIcon, Login as LoginIcon } from '@mui/icons-material'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage()
{
	const { data: session, status } = useSession()
	const router = useRouter()

	return (
		<main className={styles.main}>
			<Container maxWidth="md" className={styles.contentWrapper}>
				<Stack className={styles.content} padding={3}>
					<Typography sx={{ typography: { sm: 'h2', xs: 'h3' } }} mb={2}>
						Hobby-CMS
					</Typography>
					{status === 'authenticated' && session.user?.image && (
						<Stack alignItems="center" mb={2}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={session.user.image ?? ''} alt="" width={100} height={100} style={{ borderRadius: '50%' }} />
						</Stack>
					)}
					{status === 'unauthenticated' && (
						<Typography variant="h6" mb={2}>
							Headless CMS for anything, such as a blog or portfolio.
						</Typography>
					)}
					<Stack direction="column">
						<Box pb={2}>
							<Button
								href='https://github.com/Harley-Torrisi/Hobby-CMS'
								startIcon={<GitHubIcon />}
								variant="contained"
								sx={{
									color: 'white',
									borderColor: 'white',
									':hover': {
										color: 'warning.light',
										borderColor: 'warning.light'
									}
								}} fullWidth>
								View Project
							</Button>
						</Box>

						{status === 'authenticated' && (
							<Button
								onClick={() => router.push('/dashboard')}
								variant="contained" startIcon={<LoginIcon />}
								color="warning"
							>
								Open Dashboard
							</Button>
						)}
						{status === 'unauthenticated' && (
							<Button
								onClick={() => signIn('github')}
								variant="outlined" startIcon={<LoginIcon />}
								sx={{
									color: 'white',
									borderColor: 'white',
									':hover': {
										color: 'warning.light',
										borderColor: 'warning.light'
									}
								}}>
								Log into Dashboard
							</Button>
						)}
					</Stack>
				</Stack>
			</Container>
		</main>
	)
}
