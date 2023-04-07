'use client'

export function createGlobalTrigger()
{
	const subscribers: Record<string, () => void> = {}

	function addCallback(identifier: string, callbackHandler: () => void)
	{
		subscribers[identifier] = callbackHandler
	}

	function removeCallback(identifier: string)
	{
		delete subscribers[identifier]
	}

	function triggerCallbacks()
	{
		Object.entries(subscribers).forEach(([, f]) => f())
	}

	return {
		addCallback,
		removeCallback,
		triggerCallbacks
	}
}
