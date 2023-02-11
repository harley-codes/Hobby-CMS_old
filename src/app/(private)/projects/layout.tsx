'use client'

import { projectsPageCreateProjectTrigger } from '@/app/(private)/projects/page'
import { PageHeader, SkeletonListItems } from '@/components'
import { Alert, Box, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { Suspense } from 'react'

export default function ProjectsLayout({ children }: Children)
{
	return (
		<>
			<PageHeader headerText='Projects'>
				<Button color="success" variant="contained" onClick={() => projectsPageCreateProjectTrigger.trigger()}>New Project</Button>
			</PageHeader>
			<Stack component="main">
				<Box mb={3}>
					<Alert severity="info" variant="outlined">
						Before deleting a Project, all assigned Post&apos;s must be unassigned or deleted.
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
