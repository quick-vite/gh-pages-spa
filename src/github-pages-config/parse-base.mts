import { GitHubPackageJson } from "../shared/package-json.mts";


const ghPagesRegex = /^(?<ghpages>https:\/\/[^\/\\]*\.github\.io\/)((?<repo>[^\/\\]*)\/)?(?<error>.*)$/is
const trimSlashesRegex = /^\/|\/$/g

/**
 * Destructured base route
 */
export type BaseResult = [
    /** Vite base path */
    pathBase: string, 
    /** Base path for routers, basically @param pathBase but with slashes trimmed */
    routePath: string | undefined, 
    /** The amount of segments to skip in the GitHub Pages encoded route */
    skipSegments: number
]

/**
 * ## parseBase
 * 
 * Parse the base path from a URL.\ 
 * When a GitHub Pages URL is configured the output needs to have exactly one segment.
 * 
 * @example
 * #### GitHub Pages
 * ```ts
 * // Valid
 * const [pathBase, skipSegments] = parseBase(packageJson)
 * assert(packageJson.version).toBe('https://quick-vite.github.io/gh-pages-spa/')
 * assert(pathBase).toBe('/gh-pages-spa/')
 * assert(skipSegements).toBe(1)
 * ```
 * ```ts
 * // Invalid
 * const [pathBase, skipSegments] = parseBase(packageJson)
 * assert(packageJson.version).toBe('https://quick-vite.github.io/gh-pages-spa/extra-path/')
 * assert(skipSegements).toThrow()
 * ```
 * #### Custom domain
 * ```ts
 * // No base
 * const [pathBase, skipSegments] = parseBase(packageJson)
 * assert(packageJson.version).toBe('https://tempuri.com/')
 * assert(pathBase).toBe('/')
 * assert(skipSegements).toBe(0)
 * ```
 * ```ts
 * // Whatever you need
 * const [pathBase, skipSegments] = parseBase(packageJson)
 * assert(packageJson.version).toBe('https://acme.io/some-path/hi/')
 * assert(pathBase).toBe('/some-path/hi/')
 * assert(skipSegements).toBe(2)
 * ```
 * @param packageJson Actual package json reference
 * @returns The base path and the amount of segments necessary to skip
 */
export const parseBase = (packageJson: GitHubPackageJson): BaseResult => {

	const { homepage } = packageJson;

	if (!homepage) throw new Error('You need to configure your GitHub-Pages homepage in the package json.')
	const result = homepage.match(ghPagesRegex);

	const isPagesUrl = !!result?.groups?.ghpages
	if (isPagesUrl && !!result?.groups?.error) throw new Error(' 1 A GitHub-Pages URL needs to be formatted like "https://{user}.github.io/{repo}/"')
	if (isPagesUrl && !!result?.groups?.repo) return [`/${result!.groups!.repo!}/`, result!.groups!.repo!, 1]
	if (isPagesUrl && !result?.groups?.repo) throw new Error(' 2 A GitHub-Pages URL needs to be formatted like "https://{user}.github.io/{repo}/"')

	const pathBase = new URL(homepage).pathname
		.trim()
		.replaceAll(trimSlashesRegex, '')
	const baseSegments = pathBase.split('/').length;

	return !pathBase
		? ['/', undefined, 0]
		: [`/${pathBase}/`, pathBase, baseSegments]
}