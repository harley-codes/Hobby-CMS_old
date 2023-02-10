'use client'

import
{
	BusinessCenter as BusinessCenterIcon,
	Image as ImageIcon,
	Logout as LogoutIcon,
	Menu as MenuIcon,
	Newspaper as NewspaperIcon,
	Speed as SpeedIcon
} from '@mui/icons-material'

import { AppBar, Avatar, Box, Container, IconButton, Link, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

interface NavLink
{
	text: string
	href: string
	icon: () => JSX.Element
}

const navLinks: NavLink[] = [
	{ text: 'Dashboard', href: '/dashboard', icon: () => <SpeedIcon /> },
	{ text: 'Projects', href: '/projects', icon: () => <BusinessCenterIcon /> },
	{ text: 'Posts', href: '/posts', icon: () => <NewspaperIcon /> },
	{ text: 'Image Manager', href: '/images', icon: () => <ImageIcon /> }
]

export function LayoutNav()
{
	const theme = useTheme()
	const isMobileMode = useMediaQuery(theme.breakpoints.down('md'))
	const { data: session } = useSession()

	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

	function handleOpenNavMenu(event: React.MouseEvent<HTMLElement>)
	{
		setAnchorElNav(event.currentTarget)
	}

	function handleCloseNavMenu()
	{
		setAnchorElNav(null)
	}

	// TODO: Resolve render issues. 
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				{/* Desktop */}
				{!isMobileMode &&
					<Toolbar disableGutters>
						<Typography
							variant="h5" component="a" href="/" noWrap color="white"
							sx={{ textDecoration: 'none' }}
						>{process.env.NEXT_PUBLIC_SITE_NAME}</Typography>
						<Box marginLeft={2} display="flex" flexGrow="1">
							<Box display="flex" flexGrow="1" gap={2}>
								{navLinks.map((link, i) =>
									<Link
										key={i} href={link.href} underline="hover"
										fontWeight={500} display="flex" alignItems="center" gap={1} color="white"
									>
										{link.icon()}
										<span>{link.text}</span>
									</Link>
								)}
							</Box>
							<Box display="flex" gap={3}>
								<Link
									underline="hover"
									display="flex" alignItems="center" gap={1} fontWeight={500} color="white"
									sx={{
										color: 'white',
										'&:hover': { cursor: 'pointer' }
									}}
									onClick={() => signOut()}
								>
									{session?.user?.image
										? <Avatar src={session.user.image} />
										: <LogoutIcon />
									}
									<span> Sign Out</span>
								</Link>
							</Box>
						</Box>
					</Toolbar>
				}

				{/* Mobile */}
				{isMobileMode &&
					<Toolbar disableGutters>
						<Typography
							variant="h6" component="a" href="/" noWrap color="white"
							sx={{ textDecoration: 'none' }}
						>{process.env.NEXT_PUBLIC_SITE_NAME}</Typography>

						<Box display="flex" flexGrow={1} justifyContent="flex-end">
							<Box>
								<IconButton
									aria-controls="menu-app-bar"
									aria-haspopup="true"
									onClick={handleOpenNavMenu}
									color="inherit"
								>
									<MenuIcon />
								</IconButton>

								<Menu
									id="menu-app-bar"
									anchorEl={anchorElNav}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
									keepMounted
									transformOrigin={{ vertical: 'top', horizontal: 'left' }}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
								>
									{navLinks.map((link, i) =>
										<MenuItem
											key={i}
											onClick={handleCloseNavMenu}
											sx={{ gap: 1.5, alignItems: 'center', display: 'flex' }}
										>
											{link.icon()}
											<Typography textAlign="center">{link.text}</Typography>
										</MenuItem>
									)}
									<MenuItem
										onClick={() => signOut()}
										sx={{ gap: 1.5, alignItems: 'center', display: 'flex' }}>
										{session?.user?.image
											? <Avatar src={session.user.image} sx={{ width: 24, height: 24 }} />
											: <LogoutIcon />
										}
										<Typography textAlign="center">Sign Out</Typography>
									</MenuItem>
								</Menu>
							</Box>
						</Box>
					</Toolbar>
				}
			</Container>
		</AppBar>
	)
}
