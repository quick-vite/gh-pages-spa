import type { ManualChunksOption } from 'rollup'

/**
 * Automatically include `solid`, `@solidjs/router` and `@quick-vite/gh-pages-spa/solidjs` into it's own chunk
 */
export const solidVendorChunks: ManualChunksOption = {
    'sv-qv': [
        'solid-js',
        'solid-js/web',
        'solid-js/jsx-runtime',
        '@solidjs/router',
        '@quick-vite/gh-pages-spa/solidjs'
    ]
};