export interface ImageModel
{
	id: string
	name: string
	dataUrl: string
	date: number
}

export type ImageDetailModel = Omit<ImageModel, 'dataUrl'>
