import { ImagesPageCsr } from '@/app/(private)/images/page.csr'
import { ImageControllerSS } from '@/scripts/modules/controller/imageController'
import { createGlobalTrigger } from '@/scripts/utils/createGlobalTrigger'
import { getServerSession } from 'next-auth'

export const imagesPageCreateProjectTrigger = createGlobalTrigger().Instance

export default async function ImagesPage()
{
	const session = await getServerSession()

	if (!session) return <ImagesPageCsr count={0} pageSize={0} images={[]} />

	const pageSize = 5
	const controller = new ImageControllerSS()

	const [count, images] = await Promise.all([controller.count(), controller.getPaged(0, pageSize)])

	return <ImagesPageCsr count={count} pageSize={pageSize} images={images} />
}
