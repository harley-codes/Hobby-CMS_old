import { BaseControllerCS } from 'src/scripts/modules/controller/base/baseControllerCS'
import { BaseControllerSS } from 'src/scripts/modules/controller/base/baseControllerSS'
import { DatabaseServiceFactory } from 'src/scripts/modules/database/databaseServiceFactory'
import { ProjectModel } from 'src/scripts/modules/database/models/projectModel'

export interface ProjectControllerInterface
{
	getAll(): Promise<ProjectModel[]>
	update(id: string, name: string, active: boolean, token: string): Promise<ProjectModel>
	create(name: string, active: boolean): Promise<ProjectModel>
	delete(id: string): Promise<boolean>
}

export class ProjectControllerCS extends BaseControllerCS implements ProjectControllerInterface
{
	async getAll(): Promise<ProjectModel[]>
	{
		const response = await this.api.Request<ProjectModel[]>({
			method: 'GET',
			action: 'project',
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async create(name: string, active: boolean): Promise<ProjectModel>
	{
		const response = await this.api.Request<ProjectModel>({
			method: 'POST',
			action: 'project',
			data: { name, active }
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async update(id: string, name: string, active: boolean, token: string): Promise<ProjectModel>
	{
		const response = await this.api.Request<ProjectModel>({
			method: 'PUT',
			action: 'project',
			data: { id, name, active, token }
		})

		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}

	async delete(id: string): Promise<boolean>
	{
		const response = await this.api.Request<boolean>({
			method: 'DELETE',
			action: 'project',
			data: { id }
		})
		if (!response.succeeded || !response.data)
			throw response.responseMessage

		return response.data
	}
}

export class ProjectControllerSS extends BaseControllerSS implements ProjectControllerInterface
{
	async getAll(): Promise<ProjectModel[]>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.projectGetAll()
		await db.dispose()
		return results
	}

	async create(name: string, active: boolean): Promise<ProjectModel>
	{
		const db = await DatabaseServiceFactory.getDefault()
		// TODO: Improve how access token is created, and move to separate class.
		const token = Buffer.from(new Date().toDateString()).toString('base64url')
		const results = await db.projectCreate(name, active, token)

		await db.dispose()
		return results
	}

	async update(id: string, name: string, active: boolean, token: string): Promise<ProjectModel>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.projectUpdate(id, name, active, token)
		await db.dispose()
		return results
	}

	async delete(id: string): Promise<boolean>
	{
		const db = await DatabaseServiceFactory.getDefault()
		const results = await db.projectDelete(id)
		await db.dispose()
		return results
	}
}
