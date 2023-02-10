export default function Head()
{
	return (
		<>
			<title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>
			<meta content="width=device-width, initial-scale=1" name="viewport" />
			<meta name="description" content="Headless CMS for anything, such as a blog or portfolio." />
			<link rel="icon" href="/favicon.ico" />
			<link rel="shortcut icon" href="/favicon.ico" />
			<meta name="robots" content="noindex,nofollow" />
			<meta name="googlebot" content="noindex" />
		</>
	)
}
