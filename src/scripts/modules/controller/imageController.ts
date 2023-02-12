import { ImageCreateData } from '@/scripts/modules/database/databaseService'
import { ImageModel } from '@/scripts/modules/database/models/imageModel'
import { BaseControllerCS } from 'src/scripts/modules/controller/base/baseControllerCS'
import { DatabaseServiceFactory } from 'src/scripts/modules/database/databaseServiceFactory'

export interface ImageControllerInterface
{
	count(): Promise<number>

	get(id: string): Promise<ImageModel | null>

	getPaged(pageIndex: number, pageSize: number, searchFilter?: string): Promise<ImageModel[]>

	create(imageData: ImageCreateData): Promise<ImageModel>

	delete(id: string): Promise<void>
}

export class ImageControllerCS extends BaseControllerCS implements ImageControllerInterface
{
	async count(): Promise<number>
	{
		const response = await this.api.Request<number>({
			method: 'GET',
			action: 'image/count',
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async get(id: string): Promise<ImageModel | null>
	{
		const response = await this.api.Request<ImageModel | null>({
			method: 'GET',
			action: 'image',
			data: { id }
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async getPaged(pageIndex: number, pageSize: number, searchFilter?: string | undefined): Promise<ImageModel[]>
	{
		const response = await this.api.Request<ImageModel[]>({
			method: 'GET',
			action: 'image/paged',
			data: {pageIndex, pageSize, searchFilter}
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async create(imageData: ImageCreateData): Promise<ImageModel>
	{
		const response = await this.api.Request<ImageModel>({
			method: 'POST',
			action: 'image',
			data: imageData
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async delete(id: string): Promise<void>
	{
		const response = await this.api.Request<boolean>({
			method: 'DELETE',
			action: 'image',
			data: { id }
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage
	}
}

export class ImageControllerSS extends BaseControllerCS implements ImageControllerInterface
{
	async count(): Promise<number>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageCount()
		await db.dispose()
		return results
	}

	async get(id: string): Promise<ImageModel | null>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageGetById(id)
		await db.dispose()
		return results
	}

	async getPaged(pageIndex: number, pageSize: number, searchFilter?: string | undefined): Promise<ImageModel[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageGetPaged(pageIndex, pageSize, searchFilter)
		await db.dispose()
		return results
	}

	async create(imageData: ImageCreateData): Promise<ImageModel>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageCreate(imageData)
		await db.dispose()
		return results
	}

	async delete(id: string): Promise<void>
	{
		const db = await DatabaseServiceFactory.getDefault()
		await db.imageDelete(id)
		await db.dispose()
	}
}
