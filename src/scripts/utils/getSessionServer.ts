import { IncomingMessage, ServerResponse } from 'http'
import { NextPageContext } from 'next'
import { getServerSession, Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'

export async function getSessionApi(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<Session | null>
{
	const result = await getServerSession(req as any, res as any, authOptions) as Session | null
	return result
}

export async function getSessionServer(context: NextPageContext): Promise<Session | null>
{
	const result = await getServerSession(context.req as any, context.res as any, authOptions) as Session | null
	return result
}

export async function getSessionClient(request: IncomingMessage): Promise<Session | null>
{
	const session = await getSession({ req: request })
	return session
}
