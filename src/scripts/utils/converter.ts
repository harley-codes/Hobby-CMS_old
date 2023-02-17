export function convertToDictionary(e: any): Record<string, unknown>
{
	const returnData: Record<string, unknown> = {}
	Object.entries(e).forEach(x => returnData[x[0]] = x[1])
	return returnData
}

