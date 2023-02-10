import { BaseControllerCS } from 'src/scripts/modules/controller/base/baseControllerCS'
import { DatabaseServiceFactory } from 'src/scripts/modules/database/databaseServiceFactory'
import { PostModelDetail } from 'src/scripts/modules/database/models/postModel'

export interface PostControllerInterface
{
	getAllDetails(): Promise<PostModelDetail[]>
}

export class PostControllerCS extends BaseControllerCS implements PostControllerInterface
{
	async getAllDetails(): Promise<PostModelDetail[]>
	{
		const response = await this.api.Request<PostModelDetail[]>({
			method: 'GET',
			action: 'project',
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}
}

export class PostControllerSS extends BaseControllerCS implements PostControllerInterface
{
	async getAllDetails(): Promise<PostModelDetail[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.postGetAllDetails()
		await db.dispose()
		return results
	}
}
