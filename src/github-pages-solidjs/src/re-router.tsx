import { Component, ParentComponent } from 'solid-js';
import { Route, RouteSectionProps, useNavigate } from '@solidjs/router';
import { routeBase } from '../../shared/route-base.mts';
import { decodeGitHubPagesUrl } from '../../shared/decode-url.mts'

/**
 * GitHub Pages catch-all route. \
 * This route correctly handles the encoded GitHub Pages url, generated from the 404 redirect included in this library.
 */
export const PagesReRouter: ParentComponent = (props) => <Route path="*" component={PagesReRouterHandler} children={props.children} />

/**
 * Re-route GitHub Pages requests. \
 * We cannot use the route path because solid router strips the /?/ part
 */
const PagesReRouterHandler: Component<RouteSectionProps> = (props) => {

    if (!window.location.href.includes(`${routeBase()}/?/`)) 
        return props.children

    const navigator = useNavigate()
    navigator(decodeGitHubPagesUrl(window.location), { replace: true, resolve: false })

    // Don't use children(() => props.children)() here, these are routes and not real components. 
    return props.children
}