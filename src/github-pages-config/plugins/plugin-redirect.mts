import { type Plugin } from 'vite'

import htmlConfig from 'vite-plugin-html-config'
import { decodeGitHubPagesUrl } from '../../shared/decode-url.mts'

/**
 * ## `vite-plugin-gh-pages-spa/redirect`
 *
 * Inserts the required auto redirect script into your HTML file.
 */
export const injectGitHubPagesRedirect = (): Plugin => {

	const pluginName = 'vite-plugin-gh-pages-spa/redirect'

	return Object.assign({
		name: pluginName,
		enforce: 'pre',
	},
		htmlConfig({
			headScripts: [
				`(${replaceRedirect.toString()})(window.location, window.history)`
			]
		})
	)
}

export function replaceRedirect(location: Location, history: History) {
	
	// Single Page Apps for GitHub Pages
	// MIT License
	// https://github.com/rafgraph/spa-github-pages
	// This script checks to see if a redirect is present in the query string,
	// converts it back into the correct url and adds it to the
	// browser's history using window.history.replaceState(...),
	// which won't cause the browser to attempt to load the new url.
	// When the single page app is loaded further down in this file,
	// the correct url will be waiting in the browser's history for
	// the single page app to route accordingly.

	if (location.search[1] === '/') {
		history.replaceState(
			null, null as any,
			decodeGitHubPagesUrl(location)
		)
	}
}