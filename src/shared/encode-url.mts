/**
 * This script takes the current url and converts the path and query
 * string into just a query string, and then redirects the browser
 * to the new url with only a query string and hash fragment,\
 * e.g. https://www.foo.tld/one/two?a=b&c=d#qwe,  \
 * becomes https://www.foo.tld/?/one/two&a=b~and~c=d#qwe
 * 
 * Note: this 404.html file must be at least 512 bytes for it to work
 * with Internet Explorer (it is currently > 512 bytes)
 * 
 * @param location The current window.location
 * @param pathSegmentsToKeep 
 * @returns encoded GitHub Pages url
 */
export function encodeUrl(location:URL | Location, customDomain: boolean) {

    // If you're creating a Project Pages site and NOT using a custom domain,
    // then set pathSegmentsToKeep to 1 (enterprise users may need to set it to > 1).
    // This way the code will only replace the route part of the path, and not
    // the real directory in which the app resides, for example:
    // https://username.github.io/repo-name/one/two?a=b&c=d#qwe becomes
    // https://username.github.io/repo-name/?/one/two&a=b~and~c=d#qwe
    // Otherwise, leave pathSegmentsToKeep as 0.
    const pathSegmentsToKeep = customDomain ? 0 : 1

    const baseUrl =location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const encodedPathStart = location.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/';
    const encodedPath = location.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~');
    const encodedSearch =  (location.search ? '&' + location.search.slice(1).replace(/&/g, '~and~') : '') 
    
    return  baseUrl + encodedPathStart + encodedPath + encodedSearch + location.hash
}