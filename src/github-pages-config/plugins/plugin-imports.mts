import type { Plugin } from 'vite'
import { virtualImport } from '../../virtual/import.mts';


/**
 * ## `vite-plugin-gh-pages-spa/imports`
 *
 * Adds virtual imports associated with `@quick-vite/gh-pages-spa`
 * 
 * @example 
 * 
 * ### `routeBase`
 * ```tsx
 * import { routeBase } from 'virtual:@quick-vite/gh-pages-spa/route-base'
 * ```
 */
export const pluginVirtualImports = (routeBase: string): Plugin => {

	const pluginName = 'vite-plugin-gh-pages-spa/imports'

	const [resolveVirtualRouteBaseId, loadVirtualRouteBase] = virtualRouteBase(routeBase)

	return ({
		name: pluginName,

		resolveId: resolveVirtualRouteBaseId,
		load: loadVirtualRouteBase
	})
}

/** Import for the virtual routeBase module */
const virtualRouteBase = (routeBase: string) => virtualImport(
	'@quick-vite/gh-pages-spa/route-base', 
	{
		code: `
			export const routeBase = ${JSON.stringify(routeBase)};
			export default routeBase;
		`,
		syntheticNamedExports: true,
		moduleSideEffects: 'no-treeshake'
	}
)