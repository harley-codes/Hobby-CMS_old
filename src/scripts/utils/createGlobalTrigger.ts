export function createGlobalTrigger()
{
	class GlobalTrigger
	{
		protected static instance: GlobalTrigger

		private subscribers: Record<string, () => void> = {}

		static get Instance(): GlobalTrigger
		{
			return this.instance || (this.instance = new GlobalTrigger())
		}

		addSubscription(identifier: string, callbackHandler: () => void)
		{
			this.subscribers[identifier] = callbackHandler
		}

		removeSubscription(identifier: string)
		{
			delete this.subscribers[identifier]
		}

		trigger()
		{
			Object.entries(this.subscribers).forEach(([, f]) => f())
		}
	}

	return GlobalTrigger
}

