import { gitHubSpaConfig, seo } from "@quick-vite/gh-pages-spa/config";
import { solidVendorChunks } from "@quick-vite/gh-pages-spa/solidjs/vite";
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
		// If you want to split out the solid libraries from the main application, you can by using solidVendorChunks
		rollupOptions: {
			output: {
				manualChunks: solidVendorChunks,
			}
		},
		target: 'esnext',
		sourcemap: 'inline'
	}
})