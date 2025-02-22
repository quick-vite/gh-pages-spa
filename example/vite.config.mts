import { gitHubSpaConfig, seo } from "@quick-vite/gh-pages-spa/config";
import solid from 'vite-plugin-solid'

import packageJson from './package.json' with { type: 'json' }

export default gitHubSpaConfig(packageJson, {
    plugins: [
		solid(), 
		seo(
			packageJson,
			'/',
			'/example/1/',
			'/example/2/',
		)
	],
	build: {
		target: 'esnext'
	}
})