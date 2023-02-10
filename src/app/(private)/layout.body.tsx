'use client'

import { Box, Container } from '@mui/material'

export function LayoutBody({ children }: Children)
{
	return (
		<Box
			component="main"
			sx={{
				px: { xs: 1, sm: 2, md: 4 },
				py: 3
			}}
		>
			<Container maxWidth="xl">{children}</Container>
		</Box >
	)
}
