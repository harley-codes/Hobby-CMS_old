import { InternalFetchRequester } from 'src/scripts/utils/internalFetchRequester'

export default function Null() { }

export abstract class BaseControllerCS
{
	protected api: InternalFetchRequester

	constructor()
	{
		this.api = new InternalFetchRequester()
	}
}
