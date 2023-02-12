'use client'

import imagesPageCreateProjectTrigger from '@/app/(private)/images/newImageTrigger'
import { PageHeader, SkeletonListItems } from '@/components'
import { Alert, Box, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { Suspense } from 'react'

export default function ImagesLayout({ children }: Children)
{
	return (
		<>
			<PageHeader headerText='Images'>
				<Button color="success" variant="contained" onClick={() => imagesPageCreateProjectTrigger.trigger()}>New Image</Button>
			</PageHeader>
			<Stack component="main">
				<Box mb={3}>
					<Alert severity="info" variant="outlined">
						Before deleting a Image, all assigned features for Post&apos;s must be unassigned or deleted.
					</Alert>
				</Box>
				<Suspense fallback={<>
					<Box mb={3}>
						<SkeletonListItems items={1} itemHeight={370} />
					</Box>
					<SkeletonListItems items={3} itemHeight={56} />
				</>}>
					{children}
				</Suspense>
			</Stack>
		</>
	)
}
