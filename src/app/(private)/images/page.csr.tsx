'use client'

import { ImageModel } from '@/scripts/modules/database/models/imageModel'

import { Stack, Typography } from '@mui/material'


interface Props
{
	count: number
	pageSize: number
	images: ImageModel[]
}

export function ImagesPageCsr({ count, pageSize, images }: Props)
{
	// projectsPageCreateProjectTrigger.addSubscription('ProjectPageCsr', () => setNewProjectModelOpen(true))

	// const [isWorking, setIsWorking] = useState(false)


	return (
		<>
			{/* Project List */}
			<Stack spacing={3}>
				<Typography>Count: {count}</Typography>
				<Typography>Page Size: {pageSize}</Typography>
				<Typography>Images Length: {images.length}</Typography>
			</Stack>
			{/* Overlays */}
			{/* <ModalLoading modelOpen={isWorking} title="Please Wait" />
			<ModalNotification
				title={modalNotificationProps.title}
				message={modalNotificationProps.message}
				modelOpen={modalNotificationProps.modelOpen}
				onModalClose={() => setModalNotificationProps({ ...modalNotificationProps, modelOpen: false })}
			/>
			<ModalTextInput
				title="New Project"
				message="Select a name for your new project, all other values will bet auto generated."
				textLabel="Project Name"
				textType="text"
				modalOpen={newProjectModelOpen}
				onModalRespond={projectCreateHandler}
			/> */}
		</>
	)
}
