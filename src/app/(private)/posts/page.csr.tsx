'use client'

import { ProjectRecordModel } from '@/scripts/modules/database/models/projectModel'

import { InputText, ModalBase, ModalLoading, ModalNotification, ModalTextInput } from '@/components'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Box, Button, DialogContentText, Stack, Tooltip, Typography } from '@mui/material'

import { addNewPostCallback } from '@/app/(private)/posts/newPostsTrigger'
import { PostBlocksEditModal } from '@/app/(private)/posts/postEditModal'
import { InputDate } from '@/components/input/inputDate'
import { InputSelect } from '@/components/input/inputSelect'
import { PostControllerCS } from '@/scripts/modules/controller/postController'
import { PostBlocks, PostModelDetail } from '@/scripts/modules/database/models/postModel'
import { compareObjectsSame } from '@/scripts/utils/comparer'
import { PostStatus } from '@prisma/client'
import { useEffect, useState } from 'react'

interface Props
{
	projectRecords: ProjectRecordModel[]
	postDetails: PostModelDetail[]
}

export function PostsPageCsr({ projectRecords, postDetails }: Props)
{
	const [isWorking, setIsWorking] = useState(false)
	const [postsList, setPostsList] = useState(postDetails)
	const [selectedProject, setSelectedProject] = useState<ProjectRecordModel | undefined>(projectRecords[0])
	const [selectedPost, setSelectedPost] = useState<PostModelDetail | undefined>(postDetails[0])
	const [selectedPostBlocks, setSelectedPostBlocks] = useState<PostBlocks | undefined>()
	const [newPostModelOpen, setNewPostModelOpen] = useState(false)

	const [modalNotificationProps, setModalNotificationProps] = useState({
		title: 'Title' as undefined | string,
		message: 'Message',
		modelOpen: false,
	})

	const [newPostDetails, setNewPostDetails] = useState({ name: '', projectId: undefined as string | undefined })

	useEffect(() => addNewPostCallback('ProjectPageCsr', () =>
	{
		setNewPostModelOpen(true)
		setNewPostDetails({ name: '', projectId: selectedProject?.id })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [])

	function displayModalNotification(message: string, title?: string)
	{
		setModalNotificationProps({
			title: title,
			message: message,
			modelOpen: true,
		})
	}

	function postCreateClickHandler()
	{
		if (selectedPost)
		{
			const project = postsList.find(x => x.id === selectedPost.id)
			if (project) setSelectedPost({ ...project })
		}

		setNewPostModelOpen(true)
	}

	function postListItemSelectHandler(postId: string | undefined)
	{
		const post = [...postsList].find(x => x.id === postId)
		setSelectedPost(post)
	}

	// Need more than name!
	async function postCreateHandler()
	{
		setNewPostModelOpen(false)

		setIsWorking(true)
		try
		{
			const controller = new PostControllerCS()
			const response = await controller.create(newPostDetails.name, newPostDetails.projectId ?? null)

			displayModalNotification('Post has been created.')

			setPostsList([...postsList, response])
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	// Add Project ID
	async function postUpdateHandler(post: PostModelDetail)
	{
		if (post.name.length === 0)
		{
			displayModalNotification('Missing Post Name.', 'Cannot Save')
			return
		}

		setIsWorking(true)

		try
		{
			const controller = new PostControllerCS()
			await controller.updateDetail(post.id, post.idProject, post.name, 'DISABLED')

			const index = postsList.findIndex(x => x.id === post.id)
			postsList[index] = post
			setPostsList([...postsList])

			displayModalNotification('Post Updated.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}

		setIsWorking(false)
	}

	async function postBlocksUpdateHandler(blocks: PostBlocks)
	{
		if (!selectedPost) return

		const post = selectedPost

		setSelectedPostBlocks(undefined)
		setIsWorking(true)

		try
		{
			const controller = new PostControllerCS()
			await controller.update(post.id, { blocks })

			console.log(post)

			const index = postsList.findIndex(x => x.id === post.id)
			postsList[index] = post
			setPostsList([...postsList])

			displayModalNotification('Post Blocks Updated.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}

		setIsWorking(false)
	}

	async function postDeleteHandler(post: PostModelDetail)
	{
		setIsWorking(true)

		try
		{
			const controller = new PostControllerCS()
			await controller.delete(post.id)

			const index = postsList.findIndex(x => x.id === post.id)
			postsList.splice(index, 1)
			setPostsList([...postsList])
			setSelectedPost(undefined)

			displayModalNotification('Post has been deleted.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	return (
		<>
			{/* Posts List */}
			<Stack spacing={3}>
				{postsList.length === 0 && <>
					<Box mb={3}>
						<Alert severity="info" variant="outlined">
							No posts.
						</Alert>
					</Box>
				</>}
				{postsList.length > 0 && postsList.map(post =>
					<Accordion key={post.id} expanded={post.id === selectedPost?.id} onChange={(_, v) => postListItemSelectHandler(v ? post.id : undefined)}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} >
							<Typography variant="h6">{post.name}</Typography>
						</AccordionSummary>
						{selectedPost &&
							<>
								<AccordionDetails>
									<Stack spacing={4}>
										<InputText
											label="Post Name"
											value={selectedPost.name}
											onValueChange={(value) => setSelectedPost({ ...selectedPost, name: value })}
											inputVariant="standard"
										/>
										<InputSelect
											label='Project'
											labelId='edit-post-project'
											inputVariant='standard'
											value={selectedPost.idProject ?? undefined}
											onValueChange={
												(v) => setSelectedPost({ ...selectedPost, idProject: v })
											}
											options={
												Object.fromEntries(projectRecords.map(x => [x.id, x.name]))
											}
										/>
										<Stack spacing={4} direction="row">
											<InputSelect
												label='Status'
												labelId='edit-post-status'
												inputVariant='standard'
												value={selectedPost.status}
												onValueChange={
													(v) => setSelectedPost({ ...selectedPost, status: v as PostStatus })
												}
												options={[
													PostStatus.ACTIVE,
													PostStatus.DISABLED,
													PostStatus.HIDDEN,
												]}
											/>
											<InputDate
												label='Publish Date'
												value={selectedPost.date}
												inputVariant='standard'
												onValueChange={
													(v) => setSelectedPost({ ...selectedPost, date: v })
												}
											/>
										</Stack>
									</Stack>
								</AccordionDetails>

								<AccordionActions>
									<Stack direction="row" gap={2} paddingRight={1} paddingBottom={1}>
										<Button color='success' variant="contained" onClick={() => setSelectedPostBlocks({})}>Edit Content</Button>
										<Tooltip title="Double Click to Delete" arrow>
											<Button
												color="warning"
												onDoubleClick={() => postDeleteHandler(selectedPost)}
											>Delete</Button>
										</Tooltip>
										<Tooltip title={compareObjectsSame(post, selectedPost) ? 'Make changes to save' : ''} arrow>
											<span>
												<Button
													color="success" variant="contained"
													disabled={compareObjectsSame(post, selectedPost)}
													onClick={() => postUpdateHandler(selectedPost)}
												>Save</Button>
											</span>
										</Tooltip>
									</Stack>
								</AccordionActions>
							</>
						}
					</Accordion>
				)}
			</Stack>
			{/* Overlays */}
			<ModalLoading modelOpen={isWorking} title="Please Wait" />
			<ModalNotification
				title={modalNotificationProps.title}
				message={modalNotificationProps.message}
				modelOpen={modalNotificationProps.modelOpen}
				onModalClose={() => setModalNotificationProps({ ...modalNotificationProps, modelOpen: false })}
			/>
			<PostBlocksEditModal
				postBlocks={selectedPostBlocks}
				onRequestSave={(postBlocks) => postBlocksUpdateHandler(postBlocks)}
				onRequestCancel={() => setSelectedPostBlocks(undefined)}
			/>
			<ModalTextInput
				title="New Post"
				message="Select a name and target project for your new post, all other values will bet auto generated."
				textLabel="Post Name"
				textType="text"
				modalOpen={newPostModelOpen}
				onModalRespond={postCreateHandler}
			/>
			<ModalBase
				header='New Project'
				modalOpen={newPostModelOpen}
				size="sm"
				body={<>
					<DialogContentText marginBottom={3}>Select a name and project, all other values will bet auto generated.</DialogContentText>
					<InputSelect
						label='Project'
						labelId='new-post-project-select'
						inputVariant='standard'
						value={newPostDetails.projectId}
						onValueChange={
							(v) => setNewPostDetails({ ...newPostDetails, projectId: v })
						}
						options={
							Object.fromEntries(projectRecords.map(x => [x.id, x.name]))
						}
					/>
					<InputText
						label='Post Name'
						inputVariant='standard'
						value={newPostDetails.name}
						onValueChange={(v) => setNewPostDetails({ ...newPostDetails, name: v })}
						sx={{ mt: 2 }}
					/>
				</>}
				footer={<>
					<Button onClick={() => setNewPostModelOpen(false)}>Cancel</Button>
					<Button onClick={postCreateHandler} disabled={newPostDetails.name.length === 0}>Submit</Button>
				</>}
			/>
		</>
	)
}
