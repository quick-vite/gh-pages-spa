
/** Decode the redirected GitHub Pages URL */
export function decodeGitHubPagesUrl(location: Location): string {

    if (location.search[1] !== '/') return location.href;

    const decoded = location.search
        .slice(1)
        .split('&')
        .map((searchParam) => searchParam.replace(/~and~/g, '&'))
        .join('?')

    return location.pathname.slice(0, -1) + decoded + location.hash
}