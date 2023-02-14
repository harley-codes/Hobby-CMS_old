import { LocalStorageKeys } from '@/scripts/enums/localStorageKeys'

export function addImageToStorage(id: string, dataUrl: string)
{
	const lsImages = localStorage.getItem(LocalStorageKeys.DatabaseImages)
	const data: Record<string, string> = lsImages ? JSON.parse(lsImages) : {}
	data[id] = dataUrl
	localStorage.setItem(LocalStorageKeys.DatabaseImages, JSON.stringify(data))
}

export function addImagesToStorage(images: {id: string, dataUrl: string}[])
{
	const lsImages = localStorage.getItem(LocalStorageKeys.DatabaseImages)
	const data: Record<string, string> = lsImages ? JSON.parse(lsImages) : {}
	images.forEach(x => data[x.id] = x.dataUrl)
	localStorage.setItem(LocalStorageKeys.DatabaseImages, JSON.stringify(data))
}

export function removeImagesFromStorage(ids: string[])
{
	const lsImages = localStorage.getItem(LocalStorageKeys.DatabaseImages)
	const data: Record<string, string> = lsImages ? JSON.parse(lsImages) : {}
	ids.forEach(id => delete data[id])
	localStorage.setItem(LocalStorageKeys.DatabaseImages, JSON.stringify(data))
}

export function getImagesFromStorage(): Record<string, string>
{
	const lsImages = localStorage.getItem(LocalStorageKeys.DatabaseImages)
	const data: Record<string, string> = lsImages ? JSON.parse(lsImages) : {}
	return data
}
