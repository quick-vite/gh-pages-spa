import { type UserConfigFnObject as ViteUserConfigFnObject, type UserConfig as ViteUserConfig, type UserConfigFnPromise as ViteUserConfigFnPromise, normalizePath } from 'vite'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { viteStaticCopy } from 'vite-plugin-static-copy'
import { pluginVirtualImports } from './plugins/plugin-imports.mts'
import { GitHubPackageJson } from '../shared/package-json.mts'
import { encodeUrl } from '../shared/encode-url.mts'
import { parseBase } from './parse-base.mts'
import { ExternalOption } from 'rollup'

const __dirname = fileURLToPath(new URL("./", import.meta.url))

const appendConfig = (packageJson: GitHubPackageJson, userConfig: UserConfig) => {

	const [pathBase, routePath, skipSegments] = parseBase(packageJson)

	return Object.assign(userConfig, {
		appType: 'spa',
		base: pathBase,
		plugins: [
			pluginVirtualImports(routePath),
			viteStaticCopy({
				targets: [
					{
						src: normalizePath(path.resolve(__dirname, '../static/404.html')),
						dest: '',
						transform(content: string) {
							return content
								.replace(
									'encodeUrl(window.location, false)',
									`${encodeUrl.toString()}
									window.location.replace(encodeUrl(window.location, ${skipSegments}))`
								)
								.replace(
									'<title></title>',
									`<title>${packageJson.homepage}</title>`
								)
						}
					}
				]
			}),
			...userConfig.plugins ?? [],
		],
		
		optimizeDeps: {
			...userConfig.optimizeDeps,
			exclude: [
				...(userConfig.optimizeDeps?.exclude ?? []),
				'virtual:@quick-vite/gh-pages-spa/route-base'
			]
		},
		build:{
			rollupOptions: {
				...userConfig.build?.rollupOptions,
				external: buildExternalList(userConfig.build?.rollupOptions?.external)
			}
		}
	} as ViteUserConfig)
}

function buildExternalList(external: ExternalOption | undefined): ExternalOption {
	if (!external) return [/^virtual:/]
	if (typeof external === "string" || external instanceof RegExp) return [external, /^virtual:/]
	if (Array.isArray(external)) return [...external, /^virtual:/]
	return (source: string, importer: string | undefined, isResolved: boolean) => {
		if (/^virtual:/.test(source)) return true
		return external(source, importer, isResolved);
	}
}
/** @inheritdoc ViteUserConfig */
type UserConfig = Omit<ViteUserConfig, 'appType'>
/** @inheritdoc ViteUserConfig */
type UserConfigFnObject = (...params: Parameters<ViteUserConfigFnObject>) => ViteUserConfig
/** @inheritdoc ViteUserConfig */
type UserConfigFnPromise = (...params: Parameters<ViteUserConfigFnObject>) => Promise<ViteUserConfig>
/** @inheritdoc ViteUserConfig */
type UserConfigFn = (...params: Parameters<ViteUserConfigFnObject>) => ViteUserConfig | Promise<ViteUserConfig>;
/** @inheritdoc ViteUserConfig */
type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFnObject | UserConfigFnPromise | UserConfigFn;

/**
 * Create a pre-configured {@link ViteUserConfig vite configuration} for GitHub-Pages.
 * 
 * For documentation see: {@link https://jsr.io/@quick-vite/gh-pages-spa/doc/config}.
 */
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfig): ViteUserConfig;
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: Promise<UserConfig>): Promise<ViteUserConfig>;
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfigFnObject): ViteUserConfigFnObject;
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfigFnPromise): ViteUserConfigFnPromise;
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfigFn): UserConfigFn;
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfigExport): UserConfigExport;
export function gitHubSpaConfig(packageJson: GitHubPackageJson, config: UserConfigExport) {

	parseBase(packageJson)

	if (typeof config === 'function')
		return async (...params: Parameters<ViteUserConfigFnObject>) => appendConfig(packageJson, await config(...params))

	return Promise.resolve(config).then((c) => appendConfig(packageJson, c)) as UserConfigExport
}