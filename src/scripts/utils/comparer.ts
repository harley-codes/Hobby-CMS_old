export function compareObjectsSame<TData>(objectOne: TData, objectTwo: TData): boolean
{
	return JSON.stringify(objectOne) === JSON.stringify(objectTwo)
}
