'use client'

import { useSession } from 'next-auth/react'

export function AuthContextRequireAuth({ children }: Children)
{
	const { status } = useSession({ required: true })

	if (status === 'loading') return <p>Loading...</p>

	return <>{children}</>
}
