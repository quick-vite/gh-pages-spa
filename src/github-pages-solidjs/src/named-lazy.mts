
import { type Component, lazy } from 'solid-js'

/** 
 * ## Named `lazy`
 * Alternative to {@link lazy}, for modules that don't export default.
 * 
 * Usage: 
 * ```ts
 * namedLazy(() => import('./your-module').then(module => module.ExportedComponent))
 * ```
 */
export function namedLazy(fn: () => Promise<Component>) : ReturnType<typeof lazy<Component>>;
export function namedLazy<T extends Component<any>>(fn: () => Promise<T>) {
    return lazy(async () => ({ default: await fn() }));
}