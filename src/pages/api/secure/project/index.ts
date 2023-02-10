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
	const session = await getSessionApi(req, res)
	if (!session || !session.user)
	{
		const response = ApiResponseBuilder.unauthorized()
		return res.status(response.status).json(response)
	}

	try
	{
		if (req.method == 'GET')
		{
			const controller = new ProjectControllerSS()
			const projects = await controller.getAll()

			const response = ApiResponseBuilder.successGet(projects)
			return res.status(response.status).json(JSON.stringify(response))
		}

		if (req.method == 'POST')
		{
			const controller = new ProjectControllerSS()
			const data = req.body as ProjectModel
			const project = await controller.create(data.name, data.active)

			const response = ApiResponseBuilder.successGet(project)
			return res.status(response.status).json(JSON.stringify(response))
		}

		if (req.method == 'PUT')
		{
			const controller = new ProjectControllerSS()
			const data = req.body as ProjectModel
			const project = await controller.update(data.id, data.name, data.active, data.token)

			const response = ApiResponseBuilder.successGet(project)
			return res.status(response.status).json(JSON.stringify(response))
		}

		if (req.method == 'DELETE')
		{
			const controller = new ProjectControllerSS()
			const data = req.body as ProjectModel
			const success = await controller.delete(data.id)

			const response = ApiResponseBuilder.successGet(success)
			return res.status(response.status).json(JSON.stringify(response))
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
