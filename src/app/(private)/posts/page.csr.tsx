'use client'

import { ProjectRecordModel } from '@/scripts/modules/database/models/projectModel'

import { ModalLoading, ModalNotification, ModalTextInput, OnModalTextInputResponseEvent } from '@/components'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Stack, Tooltip, Typography } from '@mui/material'

import { postsPageCreateProjectTrigger } from '@/app/(private)/posts/page'
import { PostControllerCS } from '@/scripts/modules/controller/postController'
import { PostModelDetail } from '@/scripts/modules/database/models/postModel'
import { compareObjectsSame } from '@/scripts/utils/comparer'
import { useState } from 'react'

interface Props
{
	projectRecords: ProjectRecordModel[]
	postDetails: PostModelDetail[]
}

export function PostsPageCsr({ projectRecords, postDetails }: Props)
{
	postsPageCreateProjectTrigger.addSubscription('ProjectPageCsr', () => setNewPostModelOpen(true))

	const [isWorking, setIsWorking] = useState(false)
	const [postsList, setPostsList] = useState(postDetails)
	const [selectedPost, setSelectedPost] = useState<PostModelDetail | undefined>(postDetails[0])
	const [newPostModelOpen, setNewPostModelOpen] = useState(false)

	const [modalNotificationProps, setModalNotificationProps] = useState({
		title: 'Title' as undefined | string,
		message: 'Message',
		modelOpen: false,
	})

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
	const postCreateHandler: OnModalTextInputResponseEvent = async (dialogResponse, value) =>
	{
		setNewPostModelOpen(false)

		if (dialogResponse != 'accept' || !value) return

		setIsWorking(true)
		try
		{
			const controller = new PostControllerCS()
			const response = await controller.create(value, '')

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

	async function postDeleteHandler(post: PostModelDetail)
	{
		setIsWorking(true)

		try
		{
			const controller = new PostControllerCS()
			const success = await controller.delete(post.id)

			if (!success)
			{
				displayModalNotification('Post cannot be deleted. DB action failed.', 'Error')
				setIsWorking(false)
				return
			}

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
				{postsList.map(post =>
					<Accordion key={post.id} expanded={post.id === selectedPost?.id} onChange={(_, v) => postListItemSelectHandler(v ? post.id : undefined)}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} >
							<Typography variant="h6">{post.name}</Typography>
						</AccordionSummary>
						{selectedPost &&
							<>
								<AccordionDetails>
									<Stack spacing={4}>
										Settings
										{/* <InputSwitch
											color="success"
											label={`${selectedPost.active ? 'Is' : 'Not'} Active`}
											checked={selectedPost.active}
											onChange={(value) => setSelectedPost({ ...selectedPost, active: value })}
										/>
										<InputText
											label="Project Name"
											value={selectedPost.name}
											onValueChange={(value) => setSelectedPost({ ...selectedPost, name: value })}
										/>
										<InputPasswordOutlined
											label="Access Token"
											password={selectedPost.token}
											onPasswordChange={(value) => setSelectedPost({ ...selectedPost, token: value })} /> */}
									</Stack>
								</AccordionDetails>

								<AccordionActions>
									<Stack direction="row" gap={2} paddingRight={1} paddingBottom={1}>
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
			<ModalTextInput
				title="New Post"
				message="Select a name and target project for your new post, all other values will bet auto generated."
				textLabel="Post Name"
				textType="text"
				modalOpen={newPostModelOpen}
				onModalRespond={postCreateHandler}
			/>
		</>
	)
}
