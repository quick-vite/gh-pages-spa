import { Component, ParentComponent } from 'solid-js';
import { Route, RouteSectionProps, useNavigate } from '@solidjs/router';
import { routeBase } from '../../shared/route-base.mts';
import { decodeGitHubPagesUrl } from '../../shared/decode-url.mts'

/**
 * GitHub Pages route for showing the sitemap. \
 * This is mostly for helping the SPA, the actual sitemap will be generated.
 */
export const PagesSiteMap: ParentComponent = (props) => <Route path="/sitemap.txt" component={PagesSiteMapHandler} children={props.children} />

/**
 * Re-route GitHub Pages requests. \
 * We cannot use the route path because solid router strips the /?/ part
 */
const PagesSiteMapHandler: Component<RouteSectionProps> = (props) => {

    if (!window.location.href.includes(`${routeBase}/?/`)) 
        return props.children

    const navigator = useNavigate()
    navigator(decodeGitHubPagesUrl(window.location), { replace: true, resolve: false })

    // Don't use children(() => props.children)() here, these are routes and not real components. 
    return props.children
}