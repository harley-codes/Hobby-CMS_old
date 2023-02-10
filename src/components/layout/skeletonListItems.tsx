'use client'

import { Skeleton } from '@mui/material'
import { Stack } from '@mui/system'

type Props = {
	items: number
	itemHeight?: number | string
}

export function SkeletonListItems({ items, itemHeight }: Props)
{
	return (
		<Stack gap={3}>
			{Array(items).fill(1).map((x, i) =>
				<Skeleton variant="rounded" animation="wave" height={itemHeight} key={i} />
			)}
		</Stack>
	)
}
