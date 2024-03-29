/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
	modularizeImports: {
		'@mui/icons-material': {
			transform: '@mui/icons-material/{{member}}'
		},
		'@mui/material': {
			transform: '@mui/material/{{member}}'
		}
	}
}

module.exports = nextConfig
