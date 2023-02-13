'use client'

import imagesPageCreateProjectTrigger from '@/app/(private)/images/newImageTrigger'
import { InputText, ModalBase, ModalLoading, ModalNotification } from '@/components'
import { ImageControllerCS } from '@/scripts/modules/controller/imageController'
import { ImageModel } from '@/scripts/modules/database/models/imageModel'

import { Box, Button, ImageList, ImageListItem, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getUnixTime } from 'date-fns'
import { ChangeEvent, useRef, useState } from 'react'


interface Props
{
	count: number
	pageSize: number
	images: ImageModel[]
}

export function ImagesPageCsr({ count, pageSize, images }: Props)
{
	const theme = useTheme()
	const isMobileMode = useMediaQuery(theme.breakpoints.down('md'))
	const isTabletMode = useMediaQuery(theme.breakpoints.down('lg'))
	const imageTableCols = isMobileMode ? 2 : isTabletMode ? 4 : 6

	const [isWorking, setIsWorking] = useState(false)

	const [imageList, setImageList] = useState(images)

	const [selectedImage, setSelectedImage] = useState<ImageModel>()

	const [newImageModelOpen, setNewImageModelOpen] = useState(false)

	const [newImageProps, setNewImageProps] = useState({
		name: '',
		dataUrl: '',
	})

	const [modalNotificationProps, setModalNotificationProps] = useState({
		title: 'Title' as undefined | string,
		message: 'Message',
		modelOpen: false,
	})

	const uploadInputRef = useRef<HTMLInputElement>(null)

	imagesPageCreateProjectTrigger.addSubscription('ProjectPageCsr', () =>
	{
		uploadInputRef.current && uploadInputRef.current.click()
	})

	function displayModalNotification(message: string, title?: string)
	{
		setModalNotificationProps({
			title: title,
			message: message,
			modelOpen: true,
		})
	}

	function newImageSelectHandler(event: ChangeEvent<HTMLInputElement>)
	{

		if (!event.target.files) return

		const file = event.target.files.item(0)

		if (file == null) return

		const maxBytes = process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_UPLOAD_BYTES
		if (file.size > maxBytes)
		{
			displayModalNotification(`File to large, max size ${maxBytes}b`)
			event.target.value = ''
			return
		}

		event.target.value = ''

		const reader = new FileReader()
		reader.onload = (e) =>
		{
			setNewImageProps({
				name: file.name,
				dataUrl: reader.result as string
			})
			setNewImageModelOpen(true)
		}
		reader.readAsDataURL(file)
	}

	async function imageCreateHandler()
	{
		setNewImageModelOpen(false)

		setIsWorking(true)
		try
		{
			const controller = new ImageControllerCS()
			const response = await controller.create({
				name: newImageProps.name,
				dataUrl: newImageProps.dataUrl,
				date: getUnixTime(new Date())
			})

			displayModalNotification('Image has been created.')

			setImageList([...imageList, response])
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	async function imageDeleteHandler()
	{
		if (!selectedImage) return

		setIsWorking(true)

		try
		{
			const controller = new ImageControllerCS()
			await controller.delete(selectedImage.id)

			const index = imageList.findIndex(x => x.id === selectedImage.id)
			imageList.splice(index, 1)
			setImageList([...imageList])
			setSelectedImage(undefined)

			displayModalNotification('Image has been deleted.')
		}
		catch (error: any)
		{
			displayModalNotification(error, 'Error')
		}
		setIsWorking(false)
	}

	return (
		<>
			{/* Project List */}
			<Stack spacing={3}>
				<Typography>Count: {count}</Typography>
				<Typography>Page Size: {pageSize}</Typography>
				<Typography>Images Length: {imageList.length}</Typography>
				<ImageList cols={imageTableCols} gap={5}>
					{imageList.map((image) =>
						<ImageListItem key={image.id} sx={{ cursor: 'pointer' }}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={image.dataUrl}
								alt='error'
								style={{ width: '100%', objectFit: 'contain' }}
								title={image.name}
								loading='lazy'
								onClick={() => setSelectedImage(image)}
							/>
						</ImageListItem>
					)}
				</ImageList>
			</Stack>
			{/* Overlays */}
			<input ref={uploadInputRef} type="file" accept='image/*' style={{ display: 'none' }} onChange={newImageSelectHandler} />
			<ModalLoading modelOpen={isWorking} title="Please Wait" />
			<ModalNotification
				title={modalNotificationProps.title}
				message={modalNotificationProps.message}
				modelOpen={modalNotificationProps.modelOpen}
				onModalClose={() => setModalNotificationProps({ ...modalNotificationProps, modelOpen: false })}
			/>
			<ModalBase
				header='New Image'
				modalOpen={newImageModelOpen}
				size="sm"
				body={<>
					<InputText
						label='Image Name'
						inputVariant='standard'
						value={newImageProps.name}
						onValueChange={(v) => setNewImageProps({ ...newImageProps, name: v })}
					/>
					<Box sx={{ aspectRatio: '16 / 9' }} mt={3}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={newImageProps.dataUrl}
							alt='error'
							style={{ width: '100%', objectFit: 'contain' }}
							title={newImageProps.dataUrl}
						/>
					</Box>
				</>}
				footer={<>
					<Button onClick={() => setNewImageModelOpen(false)}>Cancel</Button>
					<Button onClick={imageCreateHandler} disabled={newImageProps.name.length === 0}>Submit</Button>
				</>}
			/>
			<ModalBase
				header={selectedImage?.name}
				modalOpen={selectedImage ? true : false}
				size="sm"
				body={selectedImage && <>
					<Typography variant="caption">ID: {selectedImage.id}</Typography>
					<Box sx={{ aspectRatio: '16 / 9' }} mt={1}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={selectedImage.dataUrl}
							alt='error'
							style={{ width: '100%', objectFit: 'contain' }}
							title={selectedImage.dataUrl}
						/>
					</Box>
				</>}
				footer={<>
					<Button onClick={() => setSelectedImage(undefined)}>Cancel</Button>
					<Button onDoubleClick={imageDeleteHandler} color="error">Delete</Button>
				</>}
			/>
		</>

	)
}
