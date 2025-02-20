import { type UserConfigFnObject as ViteUserConfigFnObject, type UserConfig as ViteUserConfig, type UserConfigFnPromise as ViteUserConfigFnPromise, normalizePath } from 'vite'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import topLevelAwait from 'vite-plugin-top-level-await'
import htmlConfig from 'vite-plugin-html-config'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { replaceRedirect } from './github-pages-config.head.mts'

const __dirname = fileURLToPath(new URL("./", import.meta.url))

const baseRegex = /^https:\/\/[^/\\]*\.github\.io\/(?<repo>[^/\\]*)\/$/isd
const parseBase = (packageJson: GitHubPackageJson) => {

	const { homepage } = packageJson;

    if (!homepage) throw new Error('You need to configure your GitHub-Pages homepage in the package json.')
	const result = homepage.match(baseRegex);
    if (!result?.groups?.repo) throw new Error('A GitHub-Pages URL needs to be formatted like "https://{user}.github.io/{repo}/"')

    return `/${result.groups!['repo']!}/`
}

const appendConfig = (packageJson: GitHubPackageJson, userConfig: UserConfig) => Object.assign(userConfig, {
    appType: 'spa',
	base: parseBase(packageJson),
    plugins: [
		topLevelAwait(),
		htmlConfig({
			headScripts: [
				`(${replaceRedirect.toString()})(window.location, window.history)`
			],
			metas: [
				// This adds a way to inspect wether gh-pages cache is invalidated
				{
					name: 'version',
					content: packageJson.version
				}
			]
		}),
		viteStaticCopy({
			targets: [
				{
					src: normalizePath(path.resolve(__dirname, '../static/404.html')),
					dest: ''
				}
			]
		}),
        ...userConfig.plugins ?? [],
    ]
} as ViteUserConfig)

type GitHubPackageJson = {
    name: string,
    version: string,
    homepage: string
}

type UserConfig = Omit<ViteUserConfig, 'appType'>
type UserConfigFnObject = (...params: Parameters<ViteUserConfigFnObject>) => ViteUserConfig
type UserConfigFnPromise = (...params: Parameters<ViteUserConfigFnObject>) => Promise<ViteUserConfig>
type UserConfigFn = (...params: Parameters<ViteUserConfigFnObject>) => ViteUserConfig | Promise<ViteUserConfig>;
type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFnObject | UserConfigFnPromise | UserConfigFn;

/**
 * Create a pre-configured {@link ViteUserConfig vite configuration} for GitHub-Pages
 */
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfig): ViteUserConfig;
export function gitHubSpaConfig(packageJson: GitHubPackageJson,config: Promise<UserConfig>): Promise<ViteUserConfig>;
export function gitHubSpaConfig(packageJson: GitHubPackageJson,config: UserConfigFnObject): ViteUserConfigFnObject;
export function gitHubSpaConfig(packageJson: GitHubPackageJson,config: UserConfigFnPromise): ViteUserConfigFnPromise;
export function gitHubSpaConfig(packageJson: GitHubPackageJson,config: UserConfigFn): UserConfigFn;
export function gitHubSpaConfig(packageJson: GitHubPackageJson,config: UserConfigExport): UserConfigExport;
export function gitHubSpaConfig(packageJson: GitHubPackageJson,config: UserConfigExport) {

    parseBase(packageJson)

    if (typeof config === 'function')
        return async (...params: Parameters<ViteUserConfigFnObject>) => appendConfig(packageJson, await config(...params))

    return Promise.resolve(config).then((c) => appendConfig(packageJson, c)) as UserConfigExport
}