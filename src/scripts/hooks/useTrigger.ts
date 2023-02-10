import { useState } from 'react'

export function useTrigger(): [triggerSet: boolean, acceptTrigger: Function]
{
	const [active, setActive] = useState(false)

	const acceptTrigger = () => setActive(true)

	return [active, acceptTrigger]
}
