import { ImagesPageCsr } from '@/app/(private)/images/page.csr'
import { ImageControllerSS } from '@/scripts/modules/controller/imageController'
import { getServerSession } from 'next-auth'

export default async function ImagesPage()
{
	const session = await getServerSession()

	const data = session ? await new ImageControllerSS().getDetailsAll() : []

	return <ImagesPageCsr imageDetails={data} />
}
