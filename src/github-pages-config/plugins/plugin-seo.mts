import { normalizePath, type Plugin } from 'vite'
import path, { dirname } from 'node:path'
import { access, readFile } from "node:fs/promises";
import { GitHubPackageJson } from '../../shared/package-json.mts';
import { encodeUrl } from '../../shared/encode-url.mts';
import { parseBase } from '../parse-base.mts';

/**
 * ## `vite-plugin-gh-pages-spa/seo`
 *
 * Generates SEO helpers for `@quick-vite/gh-pages-spa`
 * 
 * @param packageJson Your project's package json.
 * @param paths Relative paths, the generated sitemap will be absolute and encoded.
 * 
 * @example 
 * 
 * ```tsx
 * import { seo } from '@quick-vite/gh-pages-spa/config'
 * ```
 */
export const seo = (packageJson: GitHubPackageJson, ...paths: string[]): Plugin => {

	const pluginName = 'vite-plugin-gh-pages-spa/solidjs-seo'
	let projectDir = process.cwd();
		const [, , skipSegments] = parseBase(packageJson)

	return ({
		name: pluginName,
		enforce: 'post',

		async buildStart(_options) {
			this.emitFile({
				type: 'asset',
				fileName: 'sitemap.txt',
				name: 'sitemap.txt',
				needsCodeReference: false,
				source: paths
					.map(route => path
						.join(packageJson.homepage, route)
						.replace('https:\\', 'https://')
						.replaceAll( '\\', '/')
					)
					.map(url => encodeUrl(new URL(url), skipSegments))
					.join('\n')
			})

			const robotsPath = normalizePath(path.join(projectDir, './src/public/robots.txt'));
			if (await access(robotsPath).then(() => true).catch(_ => false)) {
				const original = await readFile(robotsPath).then(f => f.toString())
				if (!original.includes('Sitemap:')) {
					this.emitFile({
						type: 'asset',
						fileName: 'robots.txt',
						name: 'robots.txt',
						needsCodeReference: false,
						source: `${original}\nSitemap: ${packageJson.homepage}sitemap.txt`
					})
				}

				const replacedSource = original
					.split('\n')
					.map(line => line.trim())
					.map(line => line.startsWith('Sitemap:')
						? `Sitemap: ${packageJson.homepage}sitemap.txt`
						: line
					)
					.join('\n')
				this.emitFile({
					type: 'asset',
					fileName: 'robots.txt',
					name: 'robots.txt',
					needsCodeReference: false,
					source: replacedSource
				})
			} else {
				this.emitFile({
					type: 'asset',
					fileName: 'robots.txt',
					name: 'robots.txt',
					needsCodeReference: false,
					source: `Sitemap: ${packageJson.homepage}sitemap.txt`
				})
			}
		},

		configResolved(config) {
			if (config.configFile)
				projectDir = dirname(config.configFile)
		},
	})
}