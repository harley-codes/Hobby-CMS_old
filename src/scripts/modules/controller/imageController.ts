import { ImageCreateData } from '@/scripts/modules/database/databaseService'
import { ImageDetailModel, ImageModel } from '@/scripts/modules/database/models/imageModel'
import { BaseControllerCS } from 'src/scripts/modules/controller/base/baseControllerCS'
import { DatabaseServiceFactory } from 'src/scripts/modules/database/databaseServiceFactory'

export interface ImageControllerInterface
{
	get(id: string): Promise<ImageModel | null>

	getMany(ids: string[]): Promise<ImageModel[]>

	getDetailsAll(): Promise<ImageDetailModel[]>

	create(imageData: ImageCreateData): Promise<ImageModel>

	delete(id: string): Promise<void>
}

export class ImageControllerCS extends BaseControllerCS implements ImageControllerInterface
{
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

	async getMany(ids: string[]): Promise<ImageModel[]>
	{
		const response = await this.api.Request<ImageModel[]>({
			method: 'POST',
			action: 'image/many',
			data: { ids }
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async getDetailsAll(): Promise<ImageDetailModel[]>
	{
		const response = await this.api.Request<ImageDetailModel[]>({
			method: 'GET',
			action: 'image/detail'
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
	async get(id: string): Promise<ImageModel | null>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageGet(id)
		await db.dispose()
		return results
	}

	async getMany(ids: string[]): Promise<ImageModel[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageGetMany(ids)
		await db.dispose()
		return results
	}

	async getDetailsAll(): Promise<ImageDetailModel[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.imageGetDetailsAll()
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
