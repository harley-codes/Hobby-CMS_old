import { PrismaClient } from '@prisma/client'
import DatabaseService from 'src/scripts/modules/database/databaseService'
import { PostModel, PostModelDetail } from 'src/scripts/modules/database/models/postModel'
import { ProjectModel, ProjectRecordModel } from 'src/scripts/modules/database/models/projectModel'


export class DatabaseServicePrismaCockroach implements DatabaseService
{
	client: PrismaClient

	constructor()
	{
		this.client = new PrismaClient()
	}

	async dispose(): Promise<void>
	{
		await this.client.$disconnect()
	}

	async projectGetAll(): Promise<ProjectModel[]>
	{
		const result = await this.client.project.findMany()
		return [...result]
	}

	async projectGetRecordsAll(): Promise<ProjectRecordModel[]>
	{
		const result = await this.client.project.findMany({
			select: {
				id: true,
				name: true
			}
		})
		return [...result]
	}

	async projectCreate(name: string, active: boolean, token: string): Promise<ProjectModel>
	{
		const result = await this.client.project.create({
			data: {
				name,
				active,
				token
			}
		})
		return result
	}

	async projectUpdate(id: string, name?: string | undefined, active?: boolean | undefined, token?: string | undefined): Promise<ProjectModel>
	{
		const result = await this.client.project.update({
			where: { id },
			data: {
				name,
				active,
				token
			}
		})

		return result
	}

	async projectDelete(id: string): Promise<boolean>
	{
		const dependencies = await this.client.project.count({
			where: {
				posts: {
					some: {
						idProject: id
					}
				}
			}
		})

		if (dependencies > 0) return false

		await this.client.project.delete({
			where: {
				id: id
			}
		})
		return true
	}

	async postGetById(postId: string): Promise<PostModel | null>
	{
		const result = await this.client.post.findUnique({
			where: {
				id: postId
			}
		})

		if (result == null) return null

		return {
			...result,
			blocks: result.blocks?.valueOf() as Record<string, string>[],
			meta: result.meta?.valueOf() as Record<string, string>,
			tags: result.blocks?.valueOf() as string[],
			status: result.status
		}
	}

	async postGetAllDetails(): Promise<PostModelDetail[]>
	{
		const result = await this.client.post.findMany({
			select: {
				id: true,
				idProject: true,
				name: true,
				date: true,
				status: true
			}
		})
		return [...result]
	}
}
