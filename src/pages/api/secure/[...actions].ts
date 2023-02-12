
import { ImageControllerSS } from '@/scripts/modules/controller/imageController'
import { PostControllerSS } from '@/scripts/modules/controller/postController'
import { ImageCreateData } from '@/scripts/modules/database/databaseService'
import { PostModel, PostModelDetail } from '@/scripts/modules/database/models/postModel'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ProjectControllerSS } from 'src/scripts/modules/controller/projectController'
import { ProjectModel } from 'src/scripts/modules/database/models/projectModel'
import { getSessionApi } from 'src/scripts/utils/getSessionServer'
import { ApiResponseBuilder } from 'src/scripts/utils/internalFetchRequester'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
)
{
	const actions = req.url?.replace('/api/secure/', '').split('/') ?? []

	const session = await getSessionApi(req, res)
	if (!session || !session.user)
	{
		const response = ApiResponseBuilder.unauthorized()
		return res.status(response.status).json(response)
	}

	try
	{
		// Project
		if (actions[0] === 'project')
		{
			const controller = new ProjectControllerSS()

			// Project/Record
			if(actions[1] == 'record')
			{
				if (req.method == 'GET')
				{
					const projects = await controller.getRecordsAll()

					const response = ApiResponseBuilder.successGet(projects)
					return res.status(response.status).json(JSON.stringify(response))
				}
			}

			if (req.method == 'GET')
			{
				const projects = await controller.getAll()

				const response = ApiResponseBuilder.successGet(projects)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'POST')
			{
				const data = req.body as ProjectModel
				const project = await controller.create(data.name, data.active)

				const response = ApiResponseBuilder.successGet(project)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'PUT')
			{
				const data = req.body as ProjectModel
				const project = await controller.update(data.id, data.name, data.active, data.token)

				const response = ApiResponseBuilder.successGet(project)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'DELETE')
			{
				const data = req.body as ProjectModel
				await controller.delete(data.id)

				const response = ApiResponseBuilder.successGet(true)
				return res.status(response.status).json(JSON.stringify(response))
			}
		}

		// Post
		if (actions[0] === 'post')
		{
			const controller = new PostControllerSS()

			if(actions[1] == 'detail')
			{
				if (req.method == 'GET')
				{
					const projects = await controller.getAllDetails()

					const response = ApiResponseBuilder.successGet(projects)
					return res.status(response.status).json(JSON.stringify(response))
				}

				if (req.method == 'PUT')
				{
					const data = req.body as PostModelDetail
					const project = await controller.updateDetail(data.id, data.idProject, data.name, data.status)

					const response = ApiResponseBuilder.successGet(project)
					return res.status(response.status).json(JSON.stringify(response))
				}
			}

			if (req.method == 'GET')
			{
				const projects = await controller.getAll()

				const response = ApiResponseBuilder.successGet(projects)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'POST')
			{
				const data = req.body as PostModelDetail
				const project = await controller.create(data.name, data.idProject)

				const response = ApiResponseBuilder.successGet(project)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'PUT')
			{
				const data = req.body as PostModel
				const project = await controller.update(data.id, data)

				const response = ApiResponseBuilder.successGet(project)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'DELETE')
			{
				const data = req.body as ProjectModel
				await controller.delete(data.id)

				const response = ApiResponseBuilder.successGet(true)

				return res.status(response.status).json(JSON.stringify(response))
			}
		}

		// Image
		if (actions[0] === 'image')
		{
			const controller = new ImageControllerSS()

			if (actions[1] === 'paged')
			{
				if (req.method == 'GET')
				{
					const data = req.body
					const images = await controller.getPaged(data.pageIndex, data.pageSize, data.searchFilter)

					const response = ApiResponseBuilder.successGet(images)
					return res.status(response.status).json(JSON.stringify(response))
				}
			}

			if (actions[1] === 'count')
			{
				if (req.method == 'GET')
				{
					const count = await controller.count()

					const response = ApiResponseBuilder.successGet(count)
					return res.status(response.status).json(JSON.stringify(response))
				}
			}

			if (req.method == 'GET')
			{
				const data = req.body
				const image = await controller.get(data.id)

				const response = ApiResponseBuilder.successGet(image)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'POST')
			{
				const data = req.body as ImageCreateData
				const image = await controller.create(data)

				const response = ApiResponseBuilder.successGet(image)
				return res.status(response.status).json(JSON.stringify(response))
			}

			if (req.method == 'DELETE')
			{
				const data = req.body
				await controller.delete(data.id)

				const response = ApiResponseBuilder.successGet(true)
				return res.status(response.status).json(JSON.stringify(response))
			}
		}
	}
	catch (error: any)
	{
		const response = ApiResponseBuilder.serverError(error.message)
		return res.status(response.status).json(response)
	}

	const response = ApiResponseBuilder.notFound()
	return res.status(response.status).json(response)
}
