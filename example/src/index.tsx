/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import { routeBase, PagesReRouter, namedLazy } from '@quick-vite/gh-pages-spa/solidjs'

import { AppRoot } from './app'
import { LandingPage } from './pages/landing-page'
import { NotFoundPage } from './pages/404'

/** 
 * This is an example of only loading a page when necessary \
 * It's mostly useful for showing the solidVendorChunks
 */
const ExamplePage = namedLazy(() => import("./pages/example").then(m => m.Example));

export const routes = () => <Router base={routeBase()} root={AppRoot}>
	<PagesReRouter>
		<Route path="/example/:id/" component={ExamplePage} />
		<Route path="/" component={LandingPage} />
		<Route path="*404" component={NotFoundPage} />
	</PagesReRouter>
</Router>

render(routes, document.getElementById('root')!)