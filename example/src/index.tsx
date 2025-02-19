/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import { replaceGitHubPagesUrl } from '@quick-vite/gh-pages'
import { AppRoot } from './app'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/404'
import { Example1, Example2 } from './pages/example'

// The solid navigation fails on the homepage
// So we turn on explicitLinks and use normal anchors
render(() =>
	<Router base={import.meta.env.BASE_URL} explicitLinks={true} transformUrl={replaceGitHubPagesUrl} root={AppRoot}>
		<Route path="/path1/" component={Example1} />
		<Route path="/path2/" component={Example2} />
		<Route path="/" component={LandingPage} />
		<Route path="*404" component={NotFoundPage} />
	</Router>,
	document.getElementById('root')!
)