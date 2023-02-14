'use client'

import { addImagesToStorage, addImageToStorage, getImagesFromStorage, removeImagesFromStorage } from '@/app/(private)/images/localStorage'
import imagesPageCreateProjectTrigger from '@/app/(private)/images/newImageTrigger'
import { InputText, ModalBase, ModalLoading, ModalNotification } from '@/components'
import { ImageControllerCS } from '@/scripts/modules/controller/imageController'
import { ImageDetailModel } from '@/scripts/modules/database/models/imageModel'
import { Box, Button, ImageList, ImageListItem, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getUnixTime } from 'date-fns'
import Enumerable from 'linq'

import { ChangeEvent, useEffect, useRef, useState } from 'react'

interface Props
{
	imageDetails: ImageDetailModel[]
}

export function ImagesPageCsr(props: Props)
{


	const [isWorking, setIsWorking] = useState(false)
	const theme = useTheme()
	const isMobileMode = useMediaQuery(theme.breakpoints.down('md'))
	const isTabletMode = useMediaQuery(theme.breakpoints.down('lg'))
	const imageTableCols = isMobileMode ? 2 : isTabletMode ? 4 : 6
	const pageSize = imageTableCols
	const [paginationIndexCurrent, setPaginationIndexCurrent] = useState(0)
	const [imageDetails, setImageDetails] = useState(props.imageDetails)
	const [imageDetailsFiltered, setImageDetailsFiltered] = useState<ImageDetailModel[]>([])
	const [imageDataUrls, setImageDataUrls] = useState<Record<string, string>>({})

	const [selectedImage, setSelectedImage] = useState<ImageDetailModel>()
	const [newImageModelOpen, setNewImageModelOpen] = useState(false)
	const [newImageProps, setNewImageProps] = useState({
		name: '',
		dataUrl: '',
	})

	// Cleanup Local Storage
	useEffect(() =>
	{
		const lsImages = getImagesFromStorage()
		const lsImageKeys = Object.keys(lsImages)

		const propImageDetails = Enumerable.from(imageDetails)
		const propImageDetailKeys = propImageDetails.select(x => x.id)

		// To Remove
		const toRemove = Enumerable.from(lsImageKeys).where(x => !propImageDetailKeys.contains(x))
		if (toRemove.any())
		{
			toRemove.forEach(key => delete lsImages[key])
			removeImagesFromStorage(toRemove.toArray())
		}

		// Set Filtered
		{
			const pageIndex = paginationIndexCurrent + 1
			const filtered = Enumerable.from(imageDetails).orderBy(x => x.date).take(pageIndex * pageSize).toArray()
			setImageDetailsFiltered(filtered)
			setPaginationIndexCurrent(pageIndex)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageDetails])

	// Grab Image Data
	useEffect(() =>
	{
		setIsWorking(true)
		const lsImages = getImagesFromStorage()
		const lsImageKeys = Enumerable.from(Object.keys(lsImages))

		const toAdd = Enumerable.from(imageDetailsFiltered).where(x => !lsImageKeys.contains(x.id))

		async function get()
		{
			const data = await new ImageControllerCS().getMany(toAdd.select(x => x.id).toArray())
			data.forEach(x => lsImages[x.id] = x.dataUrl)
			addImagesToStorage(data.map(x => ({ id: x.id, dataUrl: x.dataUrl })))
			setIsWorking(false)
		}

		function end()
		{
			setImageDataUrls(lsImages)
			setIsWorking(false)
		}

		toAdd.any() && get().finally(() => end()) || end()
	}, [imageDetailsFiltered])


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

	function loadMoreHandler()
	{
		const pageIndex = paginationIndexCurrent + 1
		const filtered = Enumerable.from(imageDetails).orderBy(x => x.date).take(pageIndex * pageSize).toArray()

		setPaginationIndexCurrent(pageIndex)
		setImageDetailsFiltered(filtered)
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
		reader.onload = () =>
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
			addImageToStorage(response.id, response.dataUrl)
			setImageDetails([...imageDetails, { ...response }])
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

			const index = imageDetails.findIndex(x => x.id === selectedImage.id)
			imageDetails.splice(index, 1)
			setImageDetails([...imageDetails])
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
			<Stack spacing={3}>
				<ImageList cols={imageTableCols} gap={5}>
					{imageDetailsFiltered.map((imageDetail) =>
						<ImageListItem key={imageDetail.id} sx={{ cursor: 'pointer' }}>
							{imageDataUrls[imageDetail.id]
								? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={imageDataUrls[imageDetail.id]}
										alt='error'
										style={{ width: '100%', objectFit: 'contain' }}
										title={imageDetail.name}
										loading='lazy'
										onClick={() => setSelectedImage(imageDetail)}
									/>
								)
								: (
									<Skeleton variant="rectangular" />
								)
							}
						</ImageListItem>
					)}
					{imageDetailsFiltered.length < imageDetails.length && <>
						<Button variant='contained' onClick={loadMoreHandler}>More</Button>
					</>}
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
						{imageDataUrls[selectedImage.id]
							? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={imageDataUrls[selectedImage.id]}
									alt='error'
									style={{ width: '100%', objectFit: 'contain' }}
									title={selectedImage.name}
									loading='lazy'
								/>
							)
							: (
								<Skeleton variant="rectangular" />
							)
						}
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
