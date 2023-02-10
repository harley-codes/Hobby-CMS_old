'use client'

import { Delete as DeleteIcon } from '@mui/icons-material'
import { Button } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'

function Dash()
{
	const { data: session, status } = useSession()

	return <div>
		Hello
		<hr />
		status: {status}
		<hr />
		<span>{JSON.stringify(session)}</span>
		<hr />
		<button onClick={() => signIn('github')}>SignIn</button>
		<button onClick={() => signOut()}>SignOut</button>
		<Button startIcon={<DeleteIcon />} onClick={() => signOut()}>SignOut</Button>
	</div>
}

export default Dash
