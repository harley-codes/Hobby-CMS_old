import DatabaseService from 'src/scripts/modules/database/databaseService'
import { DatabaseServiceFactory } from 'src/scripts/modules/database/databaseServiceFactory'

export abstract class BaseControllerSS
{
	protected dbPromise: Promise<DatabaseService>

	constructor()
	{
		this.dbPromise = DatabaseServiceFactory.getDefault()
	}
}
