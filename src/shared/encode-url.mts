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
 * @param skipSegments The amount of path segments to skip
 * @returns encoded GitHub Pages url
 */
export function encodeUrl(location:URL | Location, skipSegments: number) {

    // This way the code will only replace the route part of the path, and not
    // the real directory in which the app resides, for example:
    // https://username.github.io/repo-name/{skipSegments}/two?a=b&c=d#qwe becomes
    // https://username.github.io/repo-name/?/{segments}/two&a=b~and~c=d#qwe

    const baseUrl =location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const encodedPathStart = location.pathname.split('/').slice(0, 1 + skipSegments).join('/') + '/?/';
    const encodedPath = location.pathname.slice(1).split('/').slice(skipSegments).join('/').replace(/&/g, '~and~');
    const encodedSearch =  (location.search ? '&' + location.search.slice(1).replace(/&/g, '~and~') : '') 
    
    return  baseUrl + encodedPathStart + encodedPath + encodedSearch + location.hash
}