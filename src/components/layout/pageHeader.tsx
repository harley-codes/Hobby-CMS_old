'use client'

import { Stack, Typography } from '@mui/material'

type Props = Partial<Children> &
{
	headerText: string
}

export function PageHeader({ headerText, children }: Props)
{
	return (
		<Stack direction="row" justifyContent="space-between" alignItems="center" component="header" pb={3}>
			<Typography variant="h4">{headerText}</Typography>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-end" component="header" pb={3}>
				{children}
			</Stack>
		</Stack>
	)
}
