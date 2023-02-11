import { PostUpdateData } from '@/scripts/modules/database/databaseService'
import { BaseControllerCS } from 'src/scripts/modules/controller/base/baseControllerCS'
import { DatabaseServiceFactory } from 'src/scripts/modules/database/databaseServiceFactory'
import { PostModel, PostModelDetail, PostStatus } from 'src/scripts/modules/database/models/postModel'

export interface PostControllerInterface
{
	getAll(): Promise<PostModel[]>
	getAllDetails(): Promise<PostModelDetail[]>
	create(name: string, projectId: string | null): Promise<PostModelDetail>
	update(postId: string, data: PostUpdateData): Promise<PostModel>
	updateDetail(postId: string, projectId: string | null, name: string, postStatus: PostStatus): Promise<PostModelDetail>
	delete(id: string): Promise<boolean>
}

export class PostControllerCS extends BaseControllerCS implements PostControllerInterface
{
	async getAll(): Promise<PostModel[]>
	{
		const response = await this.api.Request<PostModel[]>({
			method: 'GET',
			action: 'post',
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async getAllDetails(): Promise<PostModelDetail[]>
	{
		const response = await this.api.Request<PostModelDetail[]>({
			method: 'GET',
			action: 'post/detail',
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async create(name: string, projectId: string | null): Promise<PostModelDetail>
	{
		const response = await this.api.Request<PostModelDetail>({
			method: 'POST',
			action: 'post',
			data: { name, idProject: projectId } as PostModelDetail
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async update(postId: string, data: Partial<Omit<PostModel, 'id'>>): Promise<PostModel>
	{
		const response = await this.api.Request<PostModel>({
			method: 'PUT',
			action: 'post',
			data: { id: postId, ...data } as PostModel
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async updateDetail(postId: string, projectId: string | null, name: string, postStatus: PostStatus): Promise<PostModelDetail>
	{
		const response = await this.api.Request<PostModelDetail>({
			method: 'PUT',
			action: 'post/detail',
			data: { id: postId, idProject: projectId, name, status: postStatus } as PostModelDetail
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async delete(id: string): Promise<boolean>
	{
		const response = await this.api.Request<boolean>({
			method: 'DELETE',
			action: 'post',
			data: { id }
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}
}

export class PostControllerSS extends BaseControllerCS implements PostControllerInterface
{
	async getAll(): Promise<PostModel[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postGetAll()
		await db.dispose()
		return results
	}

	async getAllDetails(): Promise<PostModelDetail[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postGetAllDetails()
		await db.dispose()
		return results
	}

	async create(name: string, projectId: string | null): Promise<PostModelDetail>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postCreate(name, projectId)
		await db.dispose()
		return results
	}

	async update(postId: string, data: Partial<Omit<PostModel, 'id'>>): Promise<PostModel>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postUpdate(postId, data)
		await db.dispose()
		return results
	}

	async updateDetail(postId: string, projectId: string | null, name: string, postStatus: PostStatus): Promise<PostModelDetail>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postDetailUpdate(postId, projectId, name, postStatus)
		await db.dispose()
		return results
	}

	async delete(id: string): Promise<boolean>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postDelete(id)
		await db.dispose()
		return results
	}
}
