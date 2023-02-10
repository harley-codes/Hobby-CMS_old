export interface PostModel
{
	id: string
	idProject: string
	idFeaturedImage: string
	name: string
	description: string
	date: bigint
	blocks: Record<string, string>[]
	meta: Record<string, string>
	tags: string[]
	status: PostStatus
}

export interface PostModelDetail
{
	id: string
	idProject: string
	name: string
	date: bigint
	status: PostStatus
}

type PostStatus = 'ACTIVE' | 'DISABLED' | 'HIDDEN'
