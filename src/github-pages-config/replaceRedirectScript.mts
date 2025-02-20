
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
export function replaceRedirect(location: Location, history: History) {
	if (location.search[1] === '/') {
		var decoded = location.search.slice(1).split('&').map(function (s) {
			return s.replace(/~and~/g, '&')
		}).join('?')
		history.replaceState(null, null as any,
			location.pathname.slice(0, -1) + decoded + location.hash
		)
	}
}