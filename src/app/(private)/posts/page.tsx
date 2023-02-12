import { PostsPageCsr } from '@/app/(private)/posts/page.csr'
import { PostControllerSS } from '@/scripts/modules/controller/postController'
import { ProjectControllerSS } from '@/scripts/modules/controller/projectController'
import { getServerSession } from 'next-auth'

export default async function PostsPage()
{
	const session = await getServerSession()

	if (!session) return <PostsPageCsr projectRecords={[]} postDetails={[]} />

	const projectsAwaiter = new ProjectControllerSS().getRecordsAll()
	const postsAwaiter = new PostControllerSS().getAllDetails()

	const [projects, posts] = await Promise.all([projectsAwaiter, postsAwaiter])

	return <PostsPageCsr projectRecords={projects} postDetails={posts} />
}
