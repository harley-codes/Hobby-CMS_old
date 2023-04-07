'use client'

import { triggerNewPostCallbacks } from '@/app/(private)/posts/newPostsTrigger'
import { PageHeader, SkeletonListItems } from '@/components'
import { Box, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { Suspense } from 'react'

export default function PostsLayout({ children }: Children)
{
	return (
		<>
			<PageHeader headerText='Posts'>
				<Button color="success" variant="contained" onClick={() => triggerNewPostCallbacks()}>New Post</Button>
			</PageHeader>
			<Stack component="main">
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
