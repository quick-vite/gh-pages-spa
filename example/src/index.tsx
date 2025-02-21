/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import { replaceGitHubPagesUrl } from '@quick-vite/gh-pages-spa/imports'
import { routeBase } from 'virtual:@quick-vite/gh-pages-spa/route-base'
import { AppRoot } from './app'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/404'
import { Example } from './pages/example'

// The solid navigation fails on the homepage
// So we turn on explicitLinks and use normal anchors
render(() =>
	<Router base={routeBase} transformUrl={replaceGitHubPagesUrl} root={AppRoot}>
		<Route path="/example/:id/" component={Example} />
		<Route path="/" component={LandingPage} />
		<Route path="*404" component={NotFoundPage} />
	</Router>,
	document.getElementById('root')!
)