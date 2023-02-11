import { Redirect } from 'next'

export class InternalFetchRequester
{
	/** Make request to '/api/secure/{action}' */
	public async Request<TData>({
		method,
		action,
		data,
		queryParams,
		headers,
		cacheMode = 'no-store'
	}: ApiRequest)
	{
		try
		{
			const uri = `/api/secure/${action}${(queryParams && '?' + new URLSearchParams(queryParams)) || ''}`

			if (!headers) headers = {}
			headers['Content-Type'] = 'application/json'

			const requestResponse = await fetch(uri, {
				method,
				body: JSON.stringify(data),
				headers,
				cache: cacheMode
			})

			const responseUnprocessed = await requestResponse.json()

			const responseData: ApiResponse<TData> = (typeof responseUnprocessed === 'string')
				? JSON.parse(responseUnprocessed)
				: responseUnprocessed

			try
			{
				if (!requestResponse.ok && !responseData.responseMessage)
					responseData.responseMessage = requestResponse.statusText

				responseData.status = requestResponse.status
			}
			catch { }

			return responseData
		}
		catch (exception: any)
		{
			console.log('#', exception)

			if (!exception.response)
				return ApiResponseBuilder.serverError()

			if (!exception.response.data)
				return exception.response as unknown as ApiResponse<null>

			return exception.response.data as ApiResponse<null>
		}
	}
}

export class ApiResponseBuilder
{
	static notFound(responseMessage: string = 'Not Found'): ApiResponse<null>
	{
		return {
			status: HttpStatusCodes.NotFound,
			succeeded: false,
			responseMessage: responseMessage,
			data: null
		}
	}

	static serverError(responseMessage: string = 'Server Error'): ApiResponse<null>
	{
		return {
			status: HttpStatusCodes.ServerError,
			succeeded: false,
			responseMessage: responseMessage,
			data: null
		}
	}

	static unauthorized(responseMessage: string = 'Unauthorized'): ApiResponse<null>
	{
		return {
			status: HttpStatusCodes.Unauthorized,
			succeeded: false,
			responseMessage: responseMessage,
			data: null
		}
	}

	static successGet<TData>(data: TData, responseMessage: string = 'Success'): ApiResponse<TData>
	{
		return {
			status: HttpStatusCodes.SuccessGet,
			succeeded: true,
			responseMessage: responseMessage,
			data: data
		}
	}

	static successPost<TData>(data: TData, responseMessage: string = 'Success'): ApiResponse<TData>
	{
		return {
			status: HttpStatusCodes.SuccessPost,
			succeeded: true,
			responseMessage: responseMessage,
			data: data
		}
	}

	static successDelete<TData>(data: TData, responseMessage: string = 'Success'): ApiResponse<TData>
	{
		return {
			status: HttpStatusCodes.SuccessDelete,
			succeeded: true,
			responseMessage: responseMessage,
			data: data
		}
	}

	static nextRedirect(path?: string)
	{
		return {
			redirect: {
				destination: path,
				permanent: false,
			} as Redirect
		}
	}
}

interface ApiRequest
{
	method: 'GET' | 'POST' | 'DELETE' | 'PUT',
	action: string,
	data?: any,
	queryParams?: Record<string, string>,
	headers?: Record<string, string>,
	cacheMode?: RequestCache
}

export interface ApiResponse<TData>
{
	status: number
	succeeded: boolean
	responseMessage: string
	data: TData | null
}

export enum HttpStatusCodes
{
	SuccessGet = 200,
	SuccessPost = 201,
	SuccessDelete = 200,
	BadRequest = 400,
	Unauthorized = 401,
	ServerError = 500,
	NotFound = 404,
}
