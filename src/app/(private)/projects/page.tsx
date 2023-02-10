import { ProjectPageCsr } from '@/app/(private)/projects/page.csr'
import { ProjectControllerSS } from '@/scripts/modules/controller/projectController'
import { createGlobalTrigger } from '@/scripts/utils/createGlobalTrigger'
import { getServerSession } from 'next-auth'

export const projectsPageCreateProjectTrigger = createGlobalTrigger().Instance

export default async function ProjectsPage()
{
	const session = await getServerSession()

	const data = session ? await new ProjectControllerSS().getAll() : []

	return <ProjectPageCsr projects={data} />
}
