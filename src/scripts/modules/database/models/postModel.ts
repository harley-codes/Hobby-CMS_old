export interface PostModel
{
	id: string
	idProject: string | null
	idFeaturedImage: string | null
	name: string
	description: string | null
	date: bigint
	blocks: Record<string, string>[]
	meta: Record<string, string>
	tags: string[]
	status: PostStatus
}

export interface PostModelDetail
{
	id: string
	idProject: string | null
	name: string
	date: bigint
	status: PostStatus
}

export type PostStatus = 'ACTIVE' | 'DISABLED' | 'HIDDEN'
