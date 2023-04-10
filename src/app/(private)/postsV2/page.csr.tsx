'use client'

import { addNewPostCallback } from '@/app/(private)/posts/newPostsTrigger'
import { PostCreateModal } from '@/app/(private)/postsV2/post.create'
import { PostsListItem } from '@/app/(private)/postsV2/posts.item'
import { ModalLoading, ModalNotification } from '@/components'
import { PostControllerCS } from '@/scripts/modules/controller/postController'
import { PostModelDetail } from '@/scripts/modules/database/models/postModel'
import { ProjectRecordModel } from '@/scripts/modules/database/models/projectModel'
import { compareObjectsSame } from '@/scripts/utils/comparer'
import { Alert, Box, Stack } from '@mui/material'
import Enumerable from 'linq'
import { useEffect, useState } from 'react'

interface Props
{
	projectRecords: ProjectRecordModel[]
	postDetails: PostModelDetail[]
}

export function PostsPageCsr({ projectRecords, postDetails }: Props)
{
	const [postDetailList, setPostDetailList] = useState<PostModelDetail[]>(postDetails)
	const [selectedPost, setSelectedPost] = useState<PostModelDetail | undefined>()
	const [isWorking, setIsWorking] = useState(false)
	const [showNewPostModel, setShowNewPostModel] = useState(false)

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

	useEffect(() => addNewPostCallback('NewPostCallback', () =>
	{
		setShowNewPostModel(true)
	}), [postDetails])

	function setSelectedPostHandler(postId: string | null)
	{
		const post = postId == null ? undefined : postDetailList.find(x => x.id == postId)
		setSelectedPost(post)
	}

	function updateSelectedPostHandler(postId: string, data: PostModelDetail)
	{
		if (!selectedPost || postId !== selectedPost.id) return
		setSelectedPost({ ...selectedPost, ...data })
	}

	async function postDetailsUpdateHandler(postId: string)
	{
		if (postId != selectedPost?.id) return

		if (selectedPost.name.length === 0)
		{
			displayModalNotification('Missing Post Name.', 'Cannot Save')
			return
		}

		setIsWorking(true)

		try
		{
			const controller = new PostControllerCS()
			await controller.updateDetail(selectedPost.id, selectedPost.idProject, selectedPost.name, selectedPost.status)
			const index = postDetailList.findIndex(x => x.id === selectedPost.id)
			postDetailList[index] = { ...postDetailList[index], ...selectedPost }
			setPostDetailList([...postDetailList])
			displayModalNotification('Post Updated.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}

		setIsWorking(false)
	}

	async function postCreateHandler(postName: string, projectId: string | undefined)
	{
		setShowNewPostModel(false)

		setIsWorking(true)
		try
		{
			const controller = new PostControllerCS()
			const newPost = await controller.create(postName, projectId ?? null)
			displayModalNotification('Post has been created.')
			setPostDetailList([...postDetailList, newPost])
			setSelectedPost(newPost)
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	async function postDeleteHandler(postId: string)
	{
		if (postId != selectedPost?.id) return

		setIsWorking(true)

		try
		{
			const controller = new PostControllerCS()
			await controller.delete(selectedPost.id)

			const index = postDetailList.findIndex(x => x.id === selectedPost.id)
			postDetailList.splice(index, 1)
			setPostDetailList([...postDetailList])
			setSelectedPostHandler(null)
			displayModalNotification('Post has been deleted.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	if (postDetailList.length == 0) return (
		<Box mb={3}>
			<Alert severity="info" variant="outlined">
				No posts.
			</Alert>
		</Box>
	)

	return (
		<Stack spacing={3}>
			{Enumerable.from(postDetailList).orderByDescending(x => x.date).toArray().map(post => (
				<PostsListItem
					key={post.id}
					postName={post.name}
					postDetails={post.id === selectedPost?.id ? selectedPost : undefined}
					onExpandChange={(expand) => setSelectedPostHandler(expand ? post.id : null)}
					onDataChange={(data) => updateSelectedPostHandler(post.id, data)}
					projectRecords={projectRecords}
					onSave={() => postDetailsUpdateHandler(post.id)}
					onCancel={() => setSelectedPostHandler(post.id)}
					onDelete={() => postDeleteHandler(post.id)}
					hasChanged={post.id === selectedPost?.id && !compareObjectsSame(post, selectedPost)}
				/>
			))}
			{/* Overlays */}
			<ModalLoading modelOpen={isWorking} title="Please Wait" />
			<ModalNotification
				title={modalNotificationProps.title}
				message={modalNotificationProps.message}
				modelOpen={modalNotificationProps.modelOpen}
				onModalClose={() => setModalNotificationProps({ ...modalNotificationProps, modelOpen: false })}
			/>
			<PostCreateModal
				showModel={showNewPostModel}
				onCancel={() => setShowNewPostModel(false)}
				onCreate={postCreateHandler}
				projectRecords={projectRecords}
			/>
		</Stack>
	)
}
