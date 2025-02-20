/**
 * GitHub pages uses "https://{user}.github.io/{repo}/?/..." to reroute the urls.\
 * Because of this, you'll need to filter out the "/?" to make SPA routers work.
 */
export const replaceGitHubPagesUrl = (url: string): string => url
	.replace(import_meta.env.BASE_URL + '/?', import_meta.env.BASE_URL);