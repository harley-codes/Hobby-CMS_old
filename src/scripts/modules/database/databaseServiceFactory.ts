import DatabaseService from 'src/scripts/modules/database/databaseService'
import { DatabaseServicePrismaCockroach } from 'src/scripts/modules/database/vendors/prisma-cockroach/databaseServicePrismaCockroach'

enum Vendors
{
	Prisma_Cockroach = 'prisma-cockroach'
}

export class DatabaseServiceFactory
{
	public static async getDefault(): Promise<DatabaseService>
	{
		const method = process.env.DATABASE_TARGET_SERVICE

		if (!method)
			throw new Error('Cannot get default DatabaseService. No value found for DATABASE_TARGET_SERVICE')

		return this.getSpecific(method)
	}

	public static async getSpecific(vendor: string): Promise<DatabaseService>
	{
		switch (vendor)
		{
			case Vendors.Prisma_Cockroach:
				return new DatabaseServicePrismaCockroach()

			default: throw new Error(`Cannot get DatabaseContext. '${vendor}' is not implemented or invalid syntax.`)
		}
	}
}
