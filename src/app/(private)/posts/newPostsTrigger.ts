import { createGlobalTrigger } from '@/scripts/utils/createGlobalTrigger'

export const {addCallback: addNewPostCallback, triggerCallbacks: triggerNewPostCallbacks} = createGlobalTrigger()
