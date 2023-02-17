export interface PostModel
{
	id: string
	idProject: string | null
	idFeaturedImage: string | null
	name: string
	description: string | null
	date: number
	blocks: PostBlocks
	meta: Record<string, string>
	tags: string[]
	status: PostStatus
}

export type PostBlocks = Record<string, Record<string, string>>

export interface PostModelDetail
{
	id: string
	idProject: string | null
	name: string
	date: number
	status: PostStatus
}

export type PostStatus = 'ACTIVE' | 'DISABLED' | 'HIDDEN'
