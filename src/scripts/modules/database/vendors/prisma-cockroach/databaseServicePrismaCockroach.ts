import { ImageModel } from '@/scripts/modules/database/models/imageModel'
import { PrismaClient } from '@prisma/client'
import getUnixTime from 'date-fns/getUnixTime'
import DatabaseService, { ImageCreateData, PostUpdateData } from 'src/scripts/modules/database/databaseService'
import { PostModel, PostModelDetail, PostStatus } from 'src/scripts/modules/database/models/postModel'
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

	async projectDelete(id: string): Promise<void>
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

		if (dependencies > 0) throw new Error(`Project has (${dependencies}) post dependencies.`)

		await this.client.project.delete({
			where: {
				id: id
			}
		})
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
			status: result.status,
			date: Number(result.date)
		}
	}

	async postGetAll(): Promise<PostModel[]>
	{
		const result = await this.client.post.findMany()
		const resultsMapped = result.map(x => ({
			...x,
			blocks: (x.blocks?.valueOf() ?? []) as Record<string, string>[],
			meta: (x.meta?.valueOf() ?? {}) as Record<string, string>,
			tags: (x.tags?.valueOf() ?? {}) as string[],
			date: Number(x.date)
		}))
		return [...resultsMapped]
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
		return [...result.map(x => ({...x, date: Number(x.date)}))]
	}

	async postCreate(name: string, projectId: string | null): Promise<PostModelDetail>
	{
		const result = await this.client.post.create({
			data: {
				idProject: projectId,
				name,
				description: '',
				date: getUnixTime(new Date()),
				blocks: [],
				meta: {},
				tags: [],
				status: 'DISABLED'
			}
		})
		return {...result, date: Number(result.date)}
	}

	async postUpdate(postId: string, data: PostUpdateData): Promise<PostModel>
	{
		const result = await this.client.post.update({
			where: { id: postId },
			data: {...data}
		})

		return {
			...result,
			blocks: (result.blocks?.valueOf() ?? []) as Record<string, string>[],
			meta: (result.meta?.valueOf() ?? {}) as Record<string, string>,
			tags: (result.tags?.valueOf() ?? {}) as string[],
			date: Number(result.date)
		}
	}

	async postDetailUpdate(postId: string, projectId: string | null, name: string, postStatus: PostStatus): Promise<PostModelDetail>
	{
		const result = await this.client.post.update({
			where: { id: postId },
			data: {
				name,
				idProject: projectId,
				status: postStatus
			}
		})

		return {...result, date: Number(result.date)}
	}

	async postDelete(id: string): Promise<void>
	{
		await this.client.post.delete({
			where: {
				id: id
			}
		})
	}

	async imageCount(): Promise<number>
	{
		const result = await this.client.image.count()
		return result
	}

	async imageGetById(id: string): Promise<ImageModel | null>
	{
		const result = await this.client.image.findUnique({
			where: {
				id: id
			}
		})
		return result ? {...result, date: Number(result.date)} : null
	}

	async imageGetPaged(pageIndex: number, pageSize: number, searchFilter?: string): Promise<ImageModel[]>
	{
		const result = await this.client.image.findMany({
			skip: pageIndex * pageSize,
			take: pageSize,
			where: typeof searchFilter === 'undefined' ? undefined : {
				name: { contains: searchFilter}
			},
			orderBy: {
				date: 'desc'
			}
		})

		return result.map(x => ({...x, date: Number(x.date)}))
	}

	async imageCreate(imageData: ImageCreateData): Promise<ImageModel>
	{
		const result = await this.client.image.create({
			data: {...imageData}
		})
		return {...result, date: Number(result.date)}
	}

	async imageDelete(id: string): Promise<void>
	{
		await this.client.image.delete({
			where: {
				id: id
			}
		})
	}
}
